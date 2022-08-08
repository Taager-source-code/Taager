package com.taager.allocation.capacity.queries.infrastructure.controllers
import com.taager.allocation.capacity.queries.application.usecases.GetProvinceZones
import com.taager.allocation.capacity.queries.infrastructure.converters.ProvinceZonesConverter
import com.taager.allocation.openapi.api.GetProvinceZonesApi
import com.taager.allocation.openapi.model.ProvinceZoneDTO
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
import javax.validation.constraints.NotBlank
@RestController
class GetProvinceZonesController(
    private val getProvinceZones: GetProvinceZones,
    private val converter: ProvinceZonesConverter,
) : GetProvinceZonesApi {
    override fun getProvinceZones(@NotBlank provinceId: String): ResponseEntity<List<ProvinceZoneDTO>>{
        val provinceZones = getProvinceZones.execute(provinceId)
        val provinceZoneDTOs = provinceZones.map { converter.convert(it) }
        return ResponseEntity(provinceZoneDTOs, HttpStatus.OK)
    }
}
@RestControllerAdvice(basePackageClasses = [GetProvinceZonesController::class])
class GetProvinceZonesControllerAdvice {}
