package com.taager.travolta.location.controller
import com.taager.travolta.auth.domain.WarehousePrivileges.*
import com.taager.travolta.common.security.UserHelper.Companion.getCurrentSession
import com.taager.travolta.common.usermanagement.RequiredPrivilege
import com.taager.travolta.location.controller.converter.LocationDtoConverter
import com.taager.travolta.location.controller.converter.WarehouseLocationDtoConverter
import com.taager.travolta.location.service.LocationNotFoundException
import com.taager.travolta.location.service.LocationVariantGetter
import com.taager.travolta.openapi.api.LocationsApi
import com.taager.travolta.openapi.model.VariantLocationDto
import com.taager.travolta.openapi.model.WarehouseVariantLocationsDto
import net.logstash.logback.argument.StructuredArguments.keyValue
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
@RestController
class LocationsController(
    private val locationVariantGetter: LocationVariantGetter,
    private val locationDtoConverter: LocationDtoConverter,
    private val warehouseLocationDtoConverter: WarehouseLocationDtoConverter
) : LocationsApi {
    @RequiredPrivilege(oneOf = [PICK_PRODUCT, INBOUND_PRODUCT, INTERNAL_TRANSFER_PRODUCT])
    override fun getLocationsForVariant(
        variantId: String,
        pickable: Boolean?
    ): ResponseEntity<List<VariantLocationDto>> {
        val userSession = getCurrentSession()
        val variantLocations =
            locationVariantGetter.getLocationsForVariant(
                variantId,
                pickable,
                userSession.user.id,
                userSession.warehouseCode
            )
        val locationDto = variantLocations.map { locationDtoConverter.convert(it, variantId) }
        return ResponseEntity(locationDto, HttpStatus.OK)
    }
    @RequiredPrivilege(oneOf = [INSPECT_PRODUCT])
    override fun getLocationsInAllWarehousesForVariant(variantId: String, pickable: Boolean?
    ): ResponseEntity<List<WarehouseVariantLocationsDto>> {
        val groupedLocations = locationVariantGetter.getByVariantIdGroupedByWarehouse(variantId, pickable)
        val dto = groupedLocations.map { warehouseLocationDtoConverter.convert(it, variantId) }
        return ResponseEntity(dto, HttpStatus.OK)
    }
}
@RestControllerAdvice(basePackageClasses = [LocationsController::class])
class LocationsControllerAdvice {
    private val log = LoggerFactory.getLogger(LocationsControllerAdvice::class.java)
    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    @ExceptionHandler(LocationNotFoundException::class)
    fun locationNotFound(locationNotFoundException: LocationNotFoundException) {
        log.warn(
            "location not found", keyValue("locationId", locationNotFoundException.locationId),
            locationNotFoundException
        )
    }
}
