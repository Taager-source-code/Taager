package com.taager.allocation.capacity.queries.infrastructure.converters
import com.taager.allocation.capacity.queries.application.models.ProvinceResponse
import com.taager.allocation.openapi.model.ProvinceDTO
import org.springframework.stereotype.Component
@Component
class ProvinceResponseConverter {
    fun convert(province: ProvinceResponse): ProvinceDTO {
        return ProvinceDTO(
            provinceId = province.provinceId,
            name = province.name,
            noOfZones = province.noOfZones,
            remainingCapacity = province.remainingCapacity
        )
    }
}
