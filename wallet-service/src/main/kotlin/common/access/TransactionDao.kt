package com.taager.wallet.common.infrastructure.db.access
import com.taager.wallet.common.infrastructure.db.models.AmountsDbo
import com.taager.wallet.common.infrastructure.db.models.TransactionDbo
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*
@Repository
interface TransactionDao : CoroutineCrudRepository<TransactionDbo, UUID> {
    @Query(
        """
        select COALESCE(sum(trans.amount) filter ( where trans.type = 'CR' and trans.amount_type = 'ELIGIBLE'), 0) -
               COALESCE(sum(trans.amount) filter ( where trans.type = 'DR' and trans.amount_type = 'ELIGIBLE' ), 0) as eligibleAmount,
               COALESCE(sum(trans.amount) filter ( where trans.type = 'CR' and trans.amount_type = 'EXPECTED'), 0) -
                COALESCE(sum(trans.amount) filter ( where trans.type = 'DR' and trans.amount_type = 'EXPECTED' ), 0) as expectedAmount
        from transaction trans where trans.wallet_id = :walletId
        """
    )
    suspend fun findAmountsByWalletId(@Param("walletId") walletId: UUID): AmountsDbo
}