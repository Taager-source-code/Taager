package com.taager.allocation.allocator.commands.domain.contracts
import com.taager.allocation.allocator.commands.domain.models.Zone
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ProvinceName
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ZoneId
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ZoneName
interface ZoneRepo {
    fun getZonesByIds(zoneIds: List<ZoneId>): List<Zone>
    fun findZoneIdByZoneAndProvince(provinceName: ProvinceName, zoneName: ZoneName): ZoneId?
}