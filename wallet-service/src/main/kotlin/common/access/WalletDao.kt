package com.taager.wallet.common.infrastructure.db.access
import com.taager.wallet.common.infrastructure.db.models.WalletDbo
import kotlinx.coroutines.flow.Flow
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import org.springframework.stereotype.Repository
import java.util.*
@Repository
interface WalletDao : CoroutineCrudRepository<WalletDbo, UUID> {
    suspend fun findOneByTaagerIdAndCurrency(taagerId: Int, currency: String): WalletDbo?
    fun findAllByTaagerId(taagerId: Int): Flow<WalletDbo>
}