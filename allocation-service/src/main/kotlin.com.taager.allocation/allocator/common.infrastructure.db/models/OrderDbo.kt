package com.taager.allocation.allocator.common.infrastructure.db.models
import com.taager.allocation.allocator.common.infrastructure.db.enums.AllocationOrderStatus
import com.vladmihalcea.hibernate.type.basic.PostgreSQLEnumType
import org.hibernate.annotations.Type
import org.hibernate.annotations.TypeDef
import java.sql.Timestamp
import java.util.*
import javax.persistence.*
@Entity
@Table(name = "order_table")
@TypeDef(
    name = "pgsql_enum",
    typeClass = PostgreSQLEnumType::class
)
class OrderDbo(
    @Id
    @Column(name = "order_id", length = 255, nullable = false, updatable = false)
    val orderId: String,
    @OneToMany(mappedBy = "orderId", cascade = [CascadeType.ALL],fetch = FetchType.EAGER, orphanRemoval = true)
    val orderLine: MutableList<OrderLineDbo>,
    @Column(name = "country", nullable = false)
    val country: String,
    @Column(name = "zone_id", nullable = false)
    val zoneId: UUID,
    @Column(name = "company_id", nullable = true)
    val companyId: String?,
    @Column(name = "priority_id", nullable = true)
    val priorityId: UUID?,
    @Column(name = "taager_id", nullable = false)
    val taagerId: Int,
    @Column(name = "cash_on_delivery", nullable = false)
    val cashOnDelivery: Int,
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "order_status", length = 255)
    @Type( type = "pgsql_enum" )
    val status: AllocationOrderStatus,
    @Column(name = "placed_at", nullable = false)
    val placedAt: Timestamp,
    @Column(name = "confirmed_at", nullable = false)
    val confirmedAt: Timestamp,
    @Column(name = "allocated_at", nullable = true)
    val allocatedAt: Timestamp?,
    @Column(name = "shipped_out_at", nullable = true)
    val shippedOutAt: Timestamp?,
    )