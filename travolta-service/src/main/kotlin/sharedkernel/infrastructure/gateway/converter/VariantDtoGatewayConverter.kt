package com.taager.travolta.sharedkernel.infrastructure.gateway.variant.converter
import com.taager.travolta.sharedkernel.infrastructure.gateway.variant.dto.AttributeValueDTO
import com.taager.travolta.sharedkernel.infrastructure.gateway.variant.dto.VariantDto
import com.taager.travolta.variant.domain.Variant
import com.taager.travolta.variant.domain.VariantAttribute
import org.springframework.stereotype.Component
@Component
class VariantDtoGatewayConverter {
    fun convert(variantDto: VariantDto) : Variant {
        return Variant(
            id = variantDto.id,
            name = variantDto.name,
            description = variantDto.description,
            variantId = variantDto.variantId,
            picture = variantDto.picture,
            attributes = variantDto.attributes?.map { convert(it) } ?: emptyList()
        )
    }
    fun convert(attributeValueDTO: AttributeValueDTO): VariantAttribute {
        return VariantAttribute(
                type = attributeValueDTO.type,
                value = attributeValueDTO.value
        )
    }
}
