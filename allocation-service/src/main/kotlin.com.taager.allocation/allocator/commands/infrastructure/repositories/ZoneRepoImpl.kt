package com.taager.allocation.allocator.commands.infrastructure.repositories
import com.taager.allocation.allocator.commands.domain.contracts.ZoneRepo
import com.taager.allocation.allocator.commands.domain.models.Zone
import com.taager.allocation.allocator.commands.infrastructure.repositories.converters.ZoneToDomainConverter
import com.taager.allocation.allocator.common.infrastructure.db.access.ZoneDao
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ProvinceName
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ZoneId
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ZoneName
import org.springframework.stereotype.Service
import java.util.*
@Service
class ZoneRepoImpl(private val zoneDao: ZoneDao, private val zoneToDomainConverter: ZoneToDomainConverter) : ZoneRepo {
    override fun getZonesByIds(zoneIds: List<ZoneId>): List<Zone> {
        // get zones by ids
        val zonesDbo = zoneDao.findAllById(zoneIds.map { it.value })
        val zoneCapacitiesDbo = zoneDao.findZoneCapacities()
        return zoneToDomainConverter.convert(zoneCapacitiesDbo, zonesDbo)
    }
    override fun findZoneIdByZoneAndProvince(provinceName: ProvinceName, zoneName: ZoneName): ZoneId? {
        val zoneId = zoneDao.findZoneIdByZoneAndProvinceName(
            zoneName = zoneName.value,
            provinceName = provinceName.value
        )
        return zoneId?.let { ZoneId(UUID.fromString(zoneId.getZoneId())) }
    }
}