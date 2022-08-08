package com.taager.allocation.allocator.common.infrastructure.db.access
import com.taager.allocation.allocator.common.infrastructure.db.enums.AllocationOrderStatus
import com.taager.allocation.allocator.common.infrastructure.db.interfaces.OrderCountDbResult
import com.taager.allocation.allocator.common.infrastructure.db.models.OrderDbo
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
@Repository
interface OrderDao: JpaRepository<OrderDbo, String> {
    fun findByStatusAndCountry(status: AllocationOrderStatus, country: String): List<OrderDbo>
    fun findByOrderIdIn(orderIds: List<String>) : List<OrderDbo>
    @Query(
        value = """
            SELECT count(*) as orderCount FROM order_table
            WHERE status =  ANY (cast (ARRAY [:status]  as order_status[]))
            AND (cast (placed_at as date)) >= (cast (:fromDate as date)) AND  (cast (placed_at as date)) <= (cast (:toDate as date))
        """,
        nativeQuery = true
    )
    fun findOrderCount(
        @Param("status") status: String,
        @Param("fromDate") fromDate: String,
        @Param("toDate") toDate: String,
    ): OrderCountDbResult
}