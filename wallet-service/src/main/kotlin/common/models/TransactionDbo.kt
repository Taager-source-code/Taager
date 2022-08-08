package com.taager.wallet.common.infrastructure.db.models
import org.springframework.data.annotation.Id
import org.springframework.data.domain.Persistable
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.math.BigDecimal
import java.sql.Timestamp
import java.util.*
@Table("transaction")
class TransactionDbo(
    @Id
    @Column("id")
    val id: UUID,
    // this is a foreign key in Database
    @Column("wallet_id")
    val walletId: UUID,
    @Column("amount")
    val amount: BigDecimal,
    @Column(value = "amount_type")
    val amountType: String,
    @Column(value = "type")
    val type: String,
    @Column("service_type")
    val serviceType: String,
    @Column("service_sub_type")
    val serviceSubType: String?,
    @Column("service_transaction_id")
    val serviceTransactionId: String,
    @Column("operation_id")
    val operationId: UUID,
    @Column("created_at")
    val createdAt: Timestamp
) : Persistable<UUID>{
    override fun toString(): String {
        return "TransactionDbo(id=$id, walletId=$walletId, amount=$amount, amountType=$amountType, type=$type, serviceType=$serviceType, serviceSubType=$serviceSubType, serviceTransactionId='$serviceTransactionId', operationId=$operationId, createdAt=$createdAt)"
    }
    @JvmName("getId1")
    @Suppress("INAPPLICABLE_JVM_NAME")
    override fun getId(): UUID? {
        return id
    }
    override fun isNew(): Boolean {
        return true
    }
}
