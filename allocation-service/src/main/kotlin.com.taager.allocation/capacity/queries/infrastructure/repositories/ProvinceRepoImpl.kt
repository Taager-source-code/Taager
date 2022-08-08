package com.taager.allocation.capacity.queries.infrastructure.repositories
import com.taager.allocation.capacity.queries.application.contracts.ProvinceRepo
import com.taager.allocation.capacity.queries.application.models.ProvincePriorityResponse
import com.taager.allocation.capacity.queries.application.models.ProvinceResponse
import com.taager.allocation.capacity.queries.application.models.ProvinceZonesResponse
import com.taager.allocation.capacity.queries.application.models.ZonePriorityResponse
import com.taager.allocation.capacity.queries.infrastructure.db.access.ProvinceDao
import com.taager.allocation.capacity.queries.infrastructure.db.access.ZoneDao
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*
@Service("provinceQueryRepoImpl")
class ProvinceRepoImpl(
    val provinceDao: ProvinceDao,
    val zoneDao: ZoneDao
) : ProvinceRepo {
    override fun getAllProvinces(): List<ProvinceResponse> {
        val provinceResponseList = mutableListOf<ProvinceResponse>()
        val enrichedProvinceList = provinceDao.findAllProvinces()
        val remainingCapacities = provinceDao.findRemainingCapacities()
        enrichedProvinceList.distinctBy { it.getProvinceName() }.forEach { province ->
            val remainingCapacityMap = remainingCapacities
                .filter { it.getProvinceId() == province.getId() }
                .associate { it.getPriorityId() to it.getRemainingCapacity() }
            val remainingPriorityCapacity = enrichedProvinceList
                .filter { it.getId() == province.getId() && !remainingCapacityMap.contains(it.getPriorityId()) }
                .sumOf { it.getCapacity() ?: 0 }
            provinceResponseList.add(
                ProvinceResponse(
                    provinceId = province.getId(),
                    name = province.getProvinceName(),
                    noOfZones = province.getNumberOfZones(),
                    remainingCapacity = remainingPriorityCapacity + remainingCapacityMap.values.sum()
                )
            )
        }
        return provinceResponseList
    }
    override fun getAllZonesForProvince(provinceId: UUID): List<ProvinceZonesResponse> {
        val zoneList = zoneDao.findALlByProvinceId(provinceId)
        return zoneList.map {
            ProvinceZonesResponse(
                zoneId = it.id.toString(),
                name = it.name,
                manuallyModified = it.manuallyModified
            )
        }
    }
    @Transactional(readOnly = true)
    override fun getShippingCompanyPrioritiesForProvince(provinceId: UUID): List<ProvincePriorityResponse> {
        val provincePriorities = provinceDao.findPrioritiesByProvince(provinceId)
        val remainingCapacitiesMap = provinceDao.findRemainingCapacities()
            .filter { it.getProvinceId() == provinceId.toString() }
            .associate { it.getPriorityId() to it.getRemainingCapacity() }
        return provincePriorities.map {
            ProvincePriorityResponse(
                provincePriorityId = it.getPriorityId(),
                companyName = it.getCompanyName(),
                capacity = it.getCapacity(),
                remainingCapacity = remainingCapacitiesMap.getOrElse(it.getPriorityId()) { it.getCapacity() },
                capacityMode = it.getCapacityMode(),
                cutOffTime = it.getCutOffTime()
            )
        }
    }
    @Transactional(readOnly = true)
    override fun getShippingCompanyPrioritiesForZone(zoneId: UUID): List<ZonePriorityResponse> {
        val zonePriorities = zoneDao.findPrioritiesByZone(zoneId)
        val remainingCapacitiesMap = zoneDao.findRemainingCapacities()
            .filter { it.getZoneId() == zoneId.toString() }
            .associate { it.getPriorityId() to it.getRemainingCapacity() }
        return zonePriorities.map { it ->
            ZonePriorityResponse(
                zonePriorityId = it.getPriorityId(),
                companyName = it.getCompanyName(),
                capacity = it.getCapacity(),
                remainingCapacity = remainingCapacitiesMap.getOrElse(it.getPriorityId()) { it.getCapacity() },
                capacityMode = it.getCapacityMode(),
                inTesting = it.getInTesting() == 1
            )
        }
    }
}