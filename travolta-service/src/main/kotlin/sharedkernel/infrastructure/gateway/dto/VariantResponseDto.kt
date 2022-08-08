package com.taager.travolta.sharedkernel.infrastructure.gateway.variant.dto
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
@JsonIgnoreProperties(ignoreUnknown = true)
class VariantResponseDto(@JsonProperty val data: List<VariantDto>)
@JsonIgnoreProperties(ignoreUnknown = true)
class VariantDto(
        @JsonProperty("_id") val id: String,
        @JsonProperty("productName") val name: String,
        @JsonProperty("productDescription") val description: String,
        @JsonProperty("prodID") val variantId: String,
        @JsonProperty("productPicture") val picture: String,
        @JsonProperty("attributes") val attributes: List<AttributeValueDTO>?)
@JsonIgnoreProperties(ignoreUnknown = true)
class AttributeValueDTO(
        @JsonProperty("type") val type: String,
        @JsonProperty("value") val value: String)
