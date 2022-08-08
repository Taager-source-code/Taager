package com.taager.allocation.allocator.common.infrastructure.db.access
import com.taager.allocation.allocator.commands.infrastructure.repositories.interfaces.ProvinceNamesQueryResult
import com.taager.allocation.allocator.common.infrastructure.db.interfaces.ZoneCapacityDbResult
import com.taager.allocation.allocator.common.infrastructure.db.interfaces.ZoneIdDbResult
import com.taager.allocation.capacity.commands.infrastructure.db.models.ZoneDbo
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*
@Repository("allocationZoneDao")
interface ZoneDao: JpaRepository<ZoneDbo, UUID> {
    @Query(
        value = """SELECT
                        cast( zone_priorities.zone_id as varchar ) as zoneId,
                        cast( zone_priorities.priority_id as varchar ) as priorityId,
                        zone_priorities.capacity as capacity,
                        cast ((zone_priorities.capacity - count(order_table.priority_id)) as INT) as remainingCapacity
                    FROM allocation_db.public.order_table
                             LEFT JOIN zone_shipping_company_priority as zone_priorities
                                       ON "order_table".priority_id = zone_priorities.priority_id
                    WHERE
                        ( zone_priorities.capacity_mode = 'province-level' AND
                          ( order_table.status = ANY (cast (ARRAY ['SHIPPED_OUT']  as order_status[]))
                              AND
                            DATE(order_table.shipped_out_at) = (SELECT current_date)))
                       OR
                        (   zone_priorities.capacity_mode = 'province-level' AND
                            order_table.status = ANY (cast (ARRAY ['ALLOCATED']  as order_status[])))
                    GROUP BY zone_priorities.priority_id,
                             zone_priorities.zone_id,
                             zone_priorities.capacity
                    UNION
                    SELECT
                        cast( zone_priorities.zone_id as varchar ) as zoneId,
                        cast( zone_priorities.priority_id as varchar ) as priorityId,
                        zone_priorities.capacity as capacity,
                        cast ((zone_priorities.capacity - count(order_table.priority_id)) as INT) as remainingCapacity
                    FROM allocation_db.public.order_table
                             LEFT JOIN zone_shipping_company_priority as zone_priorities
                                       ON "order_table".priority_id = zone_priorities.priority_id
                                           AND "order_table".zone_id = zone_priorities.zone_id
                    WHERE
                        (   zone_priorities.capacity_mode = 'zone-level' AND
                            ( order_table.status = ANY (cast (ARRAY ['SHIPPED_OUT']  as order_status[]))
                                AND
                              DATE(order_table.shipped_out_at) = (SELECT current_date)))
                       OR
                        (   zone_priorities.capacity_mode = 'zone-level' AND
                            order_table.status = ANY (cast (ARRAY ['ALLOCATED']  as order_status[])))
                    GROUP BY zone_priorities.priority_id,
                             zone_priorities.zone_id,
                             zone_priorities.capacity""",
        nativeQuery = true
    )
    fun findZoneCapacities(): List<ZoneCapacityDbResult>
    @Query(
        value = """
            SELECT cast( zone.id as varchar) as zoneId
            FROM zone
                LEFT JOIN province on (zone.province_id = province.id)
                    WHERE province.name = :provinceName AND zone.name = :zoneName""",
        nativeQuery = true
    )
    fun findZoneIdByZoneAndProvinceName(@Param("zoneName") zoneName: String, @Param("provinceName") provinceName: String ): ZoneIdDbResult?
    @Query(
        value = """SELECT province.name as provinceName, Cast(zone.id as varchar) as zoneId
                FROM province
                LEFT JOIN zone on (zone.province_id = province.id) WHERE zone.id IN (:ids)""",
        nativeQuery = true
    )
    fun getProvinceNamesForZones(@Param("ids") zoneIds: List<UUID>): List<ProvinceNamesQueryResult>
}