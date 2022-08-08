package com.taager.wallet.common.infrastructure.db.models
import org.springframework.data.annotation.Id
import org.springframework.data.domain.Persistable
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.util.*
@Table("wallet")
class WalletDbo(
    @Id
    val id: UUID,
    @Column("taager_id")
    val taagerId: Int,
    @Column("currency_iso_code3")
    val currency: String,
    ) : Persistable<UUID> {
    @JvmName("getId1")
    @Suppress("INAPPLICABLE_JVM_NAME")
    override fun getId(): UUID? {
        return id
    }
    override fun isNew(): Boolean {
        return true
    }
}