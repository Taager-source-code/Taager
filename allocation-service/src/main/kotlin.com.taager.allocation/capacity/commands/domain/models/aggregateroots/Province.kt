package com.taager.allocation.capacity.commands.domain.models.aggregateroots
import com.taager.allocation.capacity.commands.domain.exceptions.CapacityCanNoBeEmptyException
import com.taager.allocation.capacity.commands.domain.exceptions.CapacityRequiredException
import com.taager.allocation.capacity.commands.domain.exceptions.IllegalCapacityUpdateException
import com.taager.allocation.capacity.commands.domain.exceptions.ZoneNotFoundException
import com.taager.allocation.capacity.commands.domain.models.entities.ShippingCompanyPriority
import com.taager.allocation.capacity.commands.domain.models.entities.Zone
import com.taager.allocation.capacity.commands.domain.models.valueobjects.ProvinceId
import com.taager.allocation.capacity.commands.domain.models.valueobjects.ShippingCompaniesPriorities
import com.taager.allocation.sharedkernel.domain.models.base.AggregateRoot
import com.taager.allocation.sharedkernel.domain.models.valueobjects.*
import java.util.*
class Province private constructor(
    val provinceId: ProvinceId,
    val name: ProvinceName,
    private val provincePriorities: ShippingCompaniesPriorities,
    private val zones: List<Zone>
) : AggregateRoot<ProvinceId>(provinceId) {
    companion object {
        fun of(
            provinceId: String,
            name: String,
            provincePriorities: ShippingCompaniesPriorities,
            zones: List<Zone>
        ): Province = Province(
            provinceId = ProvinceId.of(provinceId),
            name = ProvinceName(name),
            provincePriorities = provincePriorities,
            zones = zones
        )
    }
    fun addProvincePriority(
        companyId: CompanyId,
        capacity: Capacity? = null,
        capacityMode: CapacityMode,
        cutOfTime: CutOffTime
    ) {
        if (capacityMode.isProvinceLevel()) {
            if (capacity == null) throw CapacityRequiredException(capacityMode)
            addProvincePriorityWithProvinceLevelCapacity(companyId, capacity, cutOfTime)
        } else
            addProvincePriorityWithZoneLevelCapacity(companyId, cutOfTime)
    }
    private fun addProvincePriorityWithProvinceLevelCapacity(
        companyId: CompanyId,
        capacity: Capacity,
        cutOfTime: CutOffTime
    ) {
        assertValidCapacity(capacity)
        val priority = provincePriorities.addPriority(
            companyId = companyId,
            capacity = capacity,
            remainingCapacity = capacity,
            inTesting = false,
            capacityMode = CapacityMode.provinceLevel(),
            cutOfTime = cutOfTime
        )
        addPriorityToAllZones(priority)
    }
    private fun addProvincePriorityWithZoneLevelCapacity(companyId: CompanyId, cutOfTime: CutOffTime) {
        provincePriorities.addPriority(
            companyId = companyId,
            capacity = Capacity.empty(),
            remainingCapacity = Capacity.empty(),
            inTesting = false,
            capacityMode = CapacityMode.zoneLevel(),
            cutOfTime = cutOfTime
        )
    }
    fun addZonePriority(zoneId: ZoneId, provincePriorityId: PriorityId, capacity: Capacity? = null) {
        val provincePriority = provincePriorities.getPriorityOrThrowIfNotFound(provincePriorityId)
        //check the mode
        val zonePriority = cloneZoneCapacity(provincePriority, capacity)
        val zone = getZoneOrThrowIfNotFound(zoneId)
        zone.addPriority(zonePriority)
        zone.markModifiedManually()
        calculateZoneLevelCapacity()
    }
    fun removeProvincePriority(priorityId: PriorityId) {
        val provincePriority = provincePriorities.getPriorityOrThrowIfNotFound(priorityId)
        provincePriorities.removePriority(provincePriority)
        removePriorityFromAllZonesIfFound(priorityId)
    }
    fun removeZonePriority(zoneId: ZoneId, priorityId: PriorityId) {
        val zone = getZoneOrThrowIfNotFound(zoneId)
        zone.removePriorityOrThrowIfNotFound(priorityId)
        zone.markModifiedManually()
        calculateZoneLevelCapacity()
    }
    fun reSortProvincePriorities(desiredSorting: List<PriorityId>, resetZones: Boolean) {
        provincePriorities.reSortPriorities(desiredSorting)
        val zones = if (resetZones) zones else getAutomaticallyModifiedZones()
        zones.forEach { it.reset(desiredSorting) }
    }
    fun reSortZonePriorities(desiredSorting: List<PriorityId>, zoneId: ZoneId) {
        val zone = getZoneOrThrowIfNotFound(zoneId)
        zone.reSortPriorities(desiredSorting)
    }
    fun updateCapacityMode(provincePriorityId: PriorityId, newCapacityMode: CapacityMode, capacity: Capacity? = null) {
        val provincePriority = provincePriorities.getPriorityOrThrowIfNotFound(provincePriorityId)
        if (provincePriority.capacityMode == newCapacityMode)
            return
        provincePriority.updateCapacityMode(newCapacityMode)
        removePriorityFromAllZonesIfFound(provincePriority.priorityId)
        if (newCapacityMode.isZoneLevel()) {
            provincePriority.updateCapacity(Capacity.empty())
            return
        }
        if (capacity == null) throw CapacityRequiredException(newCapacityMode)
        provincePriority.updateCapacity(capacity)
        addPriorityToAllZones(provincePriority)
        return
    }
    fun updateCapacity(priorityId: PriorityId, capacity: Capacity) {
        val provincePriority = provincePriorities.getPriorityOrThrowIfNotFound(priorityId)
        if (provincePriority.capacityMode.isZoneLevel()) {
            throw IllegalCapacityUpdateException(provincePriority.capacityMode)
        }
        provincePriority.updateCapacity(capacity)
        updatePriorityCapacityInAllZonesIfFound(priorityId, capacity)
    }
    fun updateZoneCapacity(zoneId: ZoneId, priorityId: PriorityId, capacity: Capacity) {
        val provincePriority = provincePriorities.getPriorityOrThrowIfNotFound(priorityId)
        if (provincePriority.capacityMode.isProvinceLevel()) {
            throw IllegalCapacityUpdateException(provincePriority.capacityMode)
        }
        val zone = getZoneOrThrowIfNotFound(zoneId)
        zone.updateCapacity(priorityId, capacity)
        calculateZoneLevelCapacity()
    }
    fun updateZoneTestingStatus(zoneId: ZoneId, priorityId: PriorityId, testingStatus: Boolean) {
        val zone = getZoneOrThrowIfNotFound(zoneId)
        zone.updateTestingStatus(priorityId, testingStatus)
    }
    fun updateCutOffTime(priorityId: PriorityId, cutOffTime: CutOffTime) {
        val provincePriority = provincePriorities.getPriorityOrThrowIfNotFound(priorityId)
        provincePriority.updateCutOffTime(cutOffTime)
        updateCutOffTimeInAllZonesIfFound(priorityId, cutOffTime)
    }
    fun getPriorities(): List<ShippingCompanyPriority> = provincePriorities.getPriorities()
    fun getZones(): List<Zone> = Collections.unmodifiableList(zones)
    //region private methods
    private fun addPriorityToAllZones(priority: ShippingCompanyPriority) {
        zones.forEach { it.addPriority(priority) }
    }
    private fun removePriorityFromAllZonesIfFound(priorityId: PriorityId) {
        zones.forEach { it.removePriorityIfFound(priorityId) }
    }
    private fun updatePriorityCapacityInAllZonesIfFound(priorityId: PriorityId, capacity: Capacity) {
        zones.forEach { it.updatePriorityCapacityIfFound(priorityId, capacity) }
    }
    private fun updateCutOffTimeInAllZonesIfFound(priorityId: PriorityId, cutOffTime: CutOffTime) {
        zones.forEach { it.updateCutOffTimeIfFound(priorityId, cutOffTime) }
    }
    private fun cloneZoneCapacity(
        provincePriority: ShippingCompanyPriority,
        capacity: Capacity?
    ): ShippingCompanyPriority {
        return if (provincePriority.capacityMode.isProvinceLevel())
            provincePriority.clone()
        else {
            if (capacity == null) throw CapacityRequiredException(provincePriority.capacityMode)
            provincePriority.cloneWithDiffCapacity(capacity)
        }
    }
    private fun calculateZoneLevelCapacity() {
        provincePriorities.getPriorities()
            .filter { it.capacityMode.isZoneLevel() }
            .forEach(::updateCapacityFromZonePriorities)
    }
    private fun updateCapacityFromZonePriorities(provincePriority: ShippingCompanyPriority) {
        val totalCapacity = zones.map { it.findPriority(provincePriority.priorityId) }
            .mapNotNull { it }
            .map { it.capacity }
            .reduceOrNull { accCapacity, capacity -> accCapacity + capacity }
            ?: Capacity.empty()
        provincePriority.updateCapacity(totalCapacity)
    }
    private fun getZoneOrThrowIfNotFound(zoneId: ZoneId) =
        zones.find { it.zoneId == zoneId } ?: throw ZoneNotFoundException(zoneId)
    private fun getAutomaticallyModifiedZones() = zones.filter { !it.manuallyModified }
    private fun assertValidCapacity(capacity: Capacity) {
        if (capacity.isEmpty()) throw CapacityCanNoBeEmptyException()
    }
    //endregion
}