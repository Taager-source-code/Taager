package com.taager.allocation.capacity.queries.infrastructure.db.access
import com.taager.allocation.capacity.common.db.interfaces.ProvinceRemainingCapacityDbResult
import com.taager.allocation.capacity.queries.infrastructure.db.interfaces.ProvincePriorityDbResult
import com.taager.allocation.capacity.queries.infrastructure.db.interfaces.ProvinceZoneDbResult
import com.taager.allocation.capacity.queries.infrastructure.db.models.ProvinceDbo
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*
@Repository("ProvinceQueryDao")
interface ProvinceDao : JpaRepository<ProvinceDbo, UUID> {
    @Query(
        value = """SELECT
                        Cast(province.id as varchar) as id,
                        province.name as provinceName,
                        Cast(priorities.id as varchar) as priorityId,
                        priorities.capacity as capacity,
                        count(zone.province_id) as numberOfZones
                    FROM province
                             LEFT JOIN zone on (zone.province_id = province.id)
                             LEFT JOIN province_shipping_company_priority as priorities
                                       on province.id = priorities.province_id
                    GROUP BY province.id,
                             priorities.id""",
        nativeQuery = true
    )
    fun findAllProvinces(): List<ProvinceZoneDbResult>
    @Query(
        value = """SELECT
                   cast(province_shipping_company_priority.id as varchar) as priorityId,
                   province_shipping_company_priority.capacity as capacity,
                   province_shipping_company_priority.capacity_mode as capacityMode,
                   province_shipping_company_priority.cutoff_time as cutOffTime,
                   shipping_company.name as companyName
                   FROM province
                   INNER JOIN province_shipping_company_priority ON (province.id = province_shipping_company_priority.province_id)
                   INNER JOIN shipping_company ON (province_shipping_company_priority.company_id = shipping_company.id)
                   WHERE province.id= :provinceId
                   ORDER BY province_shipping_company_priority.priority ASC""",
        nativeQuery = true
    )
    fun findPrioritiesByProvince(@Param("provinceId") provinceId: UUID): List<ProvincePriorityDbResult>
    @Query(
        value = """SELECT
                    cast( province_priority.province_id as varchar ) as provinceId,
                    cast( province_priority.id as varchar ) as priorityId,
                    cast ((province_priority.capacity - count(order_table.priority_id)) as INT) as remainingCapacity
                FROM allocation_db.public.order_table
                         LEFT JOIN province_shipping_company_priority as province_priority
                                   ON "order_table".priority_id = province_priority.id
                WHERE
                    (
                        ( order_table.status = ANY (cast (ARRAY ['SHIPPED_OUT']  as order_status[])) AND DATE(order_table.shipped_out_at) = (SELECT current_date) )
                            OR
                        ( order_table.status = ANY (cast (ARRAY ['ALLOCATED']  as order_status[])) )
                    )
                GROUP BY province_priority.province_id,
                         province_priority.id,
                         province_priority.capacity""",
        nativeQuery = true
    )
    fun findRemainingCapacities() : List<ProvinceRemainingCapacityDbResult>
}