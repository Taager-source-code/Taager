package com.taager.allocation.capacity.queries.infrastructure.db.access
import com.taager.allocation.capacity.queries.infrastructure.db.interfaces.ZonePriorityDbResult
import com.taager.allocation.capacity.common.db.interfaces.ZoneRemainingCapacityDbResult
import com.taager.allocation.capacity.queries.infrastructure.db.models.ZoneDbo
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*
@Repository
interface ZoneDao : JpaRepository<ZoneDbo, UUID> {
    fun findALlByProvinceId(provinceId: UUID): List<ZoneDbo>
    @Query(
        value = """
            SELECT zone_shipping_company_priority.capacity as capacity, 
            cast(zone_shipping_company_priority.priority_id as varchar) as priorityId, 
            zone_shipping_company_priority.capacity_mode as capacityMode, 
            zone_shipping_company_priority.cutoff_time as cutOffTime, 
            zone_shipping_company_priority.in_testing as inTesting, 
            shipping_company.name as companyName 
            FROM zone 
            INNER JOIN zone_shipping_company_priority ON (zone.id = zone_shipping_company_priority.zone_id) 
            INNER JOIN shipping_company ON (zone_shipping_company_priority.company_id = shipping_company.id) 
            WHERE zone.id= :zoneId 
            ORDER BY zone_shipping_company_priority.priority ASC""",
        nativeQuery = true
    )
    fun findPrioritiesByZone(@Param("zoneId") zoneId: UUID): List<ZonePriorityDbResult>
    @Query(
        value = """SELECT
                        cast( zone_priorities.zone_id as varchar ) as zoneId,
                        cast( zone_priorities.priority_id as varchar ) as priorityId,
                        cast ((zone_priorities.capacity - count(order_table.priority_id)) as INT) as remainingCapacity
                    FROM allocation_db.public.order_table
                             LEFT JOIN zone_shipping_company_priority as zone_priorities
                                       ON "order_table".priority_id = zone_priorities.priority_id
                    WHERE
                        ( zone_priorities.capacity_mode = 'province-level' ) AND
                        (
                                ( order_table.status = ANY (cast (ARRAY ['SHIPPED_OUT']  as order_status[])) AND DATE(order_table.shipped_out_at) = (SELECT current_date) )
                                OR
                                ( order_table.status = ANY (cast (ARRAY ['ALLOCATED']  as order_status[])) )
                            )
                    GROUP BY zone_priorities.priority_id,
                             zone_priorities.zone_id,
                             zone_priorities.capacity
                    UNION
                    SELECT
                        cast( zone_priorities.zone_id as varchar ) as zoneId,
                        cast( zone_priorities.priority_id as varchar ) as priorityId,
                        cast ((zone_priorities.capacity - count(order_table.priority_id)) as INT) as remainingCapacity
                    FROM allocation_db.public.order_table
                             LEFT JOIN zone_shipping_company_priority as zone_priorities
                                       ON "order_table".priority_id = zone_priorities.priority_id
                                           AND "order_table".zone_id = zone_priorities.zone_id
                    WHERE
                        (   zone_priorities.capacity_mode = 'zone-level' ) AND
                        (
                                ( order_table.status = ANY (cast (ARRAY ['SHIPPED_OUT']  as order_status[])) AND DATE(order_table.shipped_out_at) = (SELECT current_date))
                                OR
                                ( order_table.status = ANY (cast (ARRAY ['ALLOCATED']  as order_status[])) )
                            )
                    GROUP BY zone_priorities.priority_id,
                             zone_priorities.zone_id,
                             zone_priorities.capacity""",
        nativeQuery = true
    )
    fun findRemainingCapacities(): List<ZoneRemainingCapacityDbResult>
}