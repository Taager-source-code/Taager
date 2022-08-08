package com.taager.allocation.capacity.queries.infrastructure.controllers
import com.taager.allocation.capacity.queries.application.usecases.GetProvinces
import com.taager.allocation.capacity.queries.infrastructure.converters.ProvinceResponseConverter
import com.taager.allocation.openapi.api.GetProvincesApi
import com.taager.allocation.openapi.model.ProvinceDTO
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
@RestController
class GetProvincesController(
    private val getProvinces: GetProvinces,
    private val converter: ProvinceResponseConverter,
) : GetProvincesApi {
    override fun getProvinces(): ResponseEntity<List<ProvinceDTO>> {
        val provinces = getProvinces.execute()
        val provinceDTOs = provinces.map { converter.convert(it) }
        return ResponseEntity(provinceDTOs, HttpStatus.OK)
    }
}
@RestControllerAdvice(basePackageClasses = [GetProvincesController::class])
class GetProvincesControllerAdvice {}
