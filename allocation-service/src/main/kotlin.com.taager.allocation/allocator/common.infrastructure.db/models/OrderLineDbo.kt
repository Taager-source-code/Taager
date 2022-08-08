package com.taager.allocation.allocator.common.infrastructure.db.models
import java.util.*
import javax.persistence.*
@Entity
@Table(name = "order_line")
class OrderLineDbo(
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    val id: UUID,
    @ManyToOne(
        fetch = FetchType.LAZY
    )
    @JoinColumn(
        name = "order_id",
        referencedColumnName = "order_id",
        foreignKey = ForeignKey(name = "Fk_order_id_order_line")
    )
    val orderId: OrderDbo,
    @Column(name = "product_id",length = 255, nullable = false)
    val productId: String,
    @Column(name = "price", nullable = false)
    val price: Int,
    @Column(name = "quantity", nullable = false)
    val quantity: Int
)