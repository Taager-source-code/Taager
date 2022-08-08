vpackage com.taager.wallet.commands.infrastructure.processors.pulsar.models
import com.fasterxml.jackson.annotation.JsonProperty
import java.math.BigDecimal
data class PlaceTransactionDto(
    val taagerId: Int,
    val currency: CurrencyDto,
    val serviceTransactionId: String,
    val serviceType: ServiceTypeDTO,
    val serviceSubType: String,
    val amount: BigDecimal
)
enum class ServiceTypeDTO(val value: String) {
     @JsonProperty("Orders") ORDERS("Orders"),
     @JsonProperty("WithdrawalRequest")  WITHDRAWAL_REQUEST("WithdrawalRequest"),
     @JsonProperty("Compensation") COMPENSATION("Compensation");
}
enum class CurrencyDto(val value: String) {
     EGP("EGP"),
     SAR("SAR");
}
