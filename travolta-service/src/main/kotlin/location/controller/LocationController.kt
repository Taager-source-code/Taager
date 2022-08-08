package com.taager.travolta.location.controller
import com.taager.travolta.auth.domain.WarehousePrivileges.*
import com.taager.travolta.common.security.UserHelper.Companion.getCurrentSession
import com.taager.travolta.common.usermanagement.RequiredPrivilege
import com.taager.travolta.location.controller.converter.LocationDtoConverter
import com.taager.travolta.location.domain.RemovalMode
import com.taager.travolta.location.service.*
import com.taager.travolta.openapi.api.LocationApi
import com.taager.travolta.openapi.model.LocationDto
import com.taager.travolta.openapi.model.RemovalModeDto
import com.taager.travolta.openapi.model.VariantUpdateDto
import com.taager.travolta.variant.service.VariantNotFoundException
import net.logstash.logback.argument.StructuredArguments.keyValue
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
@RestController
class LocationController(
  private val locationVariantAdder: LocationVariantAdder,
  private val locationVariantRemover: LocationVariantRemover,
  private val locationVariantGetter: LocationVariantGetter,
  private val converter: LocationDtoConverter,
) : LocationApi {
  @RequiredPrivilege(oneOf = [INBOUND_PRODUCT, INTERNAL_TRANSFER_PRODUCT])
  override fun addVariantToLocation(variantUpdateDto: VariantUpdateDto): ResponseEntity<Unit> {
    val currentUser = getCurrentSession()
    val locationVariant = converter.convert(variantUpdateDto)
    locationVariantAdder.addVariant(currentUser.user.id, currentUser.warehouseCode, locationVariant)
    return ResponseEntity(HttpStatus.OK)
  }
  @RequiredPrivilege(oneOf = [PICK_PRODUCT, INTERNAL_TRANSFER_PRODUCT])
  override fun removeVariantFromLocation(variantUpdateDto: VariantUpdateDto, mode: RemovalModeDto): ResponseEntity<Unit> {
    val currentUser = getCurrentSession()
    val locationVariant = converter.convert(variantUpdateDto)
    locationVariantRemover.removeVariant(currentUser.user.id, currentUser.warehouseCode, locationVariant, RemovalMode.STRICT)
    return ResponseEntity(HttpStatus.OK)
  }
  override fun getLocationByBarcode(barcode: String): ResponseEntity<LocationDto> {
    val currentUser = getCurrentSession()
    val trimmedBarcode = barcode.trim()
    val locationDomain = locationVariantGetter.getByBarcode(currentUser.user.id, currentUser.warehouseCode, trimmedBarcode)
    val locationDto = converter.convert(locationDomain)
    return ResponseEntity(locationDto, HttpStatus.OK)
  }
}
@RestControllerAdvice(basePackageClasses = [LocationController::class])
class LocationControllerAdvice {
  private val log = LoggerFactory.getLogger(LocationControllerAdvice::class.java)
  @ResponseStatus(value = HttpStatus.NOT_FOUND)
  @ExceptionHandler(LocationNotFoundException::class)
  fun locationNotFound(locationNotFoundException: LocationNotFoundException) {
    log.warn(
      "Location not found", keyValue("locationId", locationNotFoundException.locationId),
      locationNotFoundException
    )
  }
  @ResponseStatus(value = HttpStatus.NOT_FOUND)
  @ExceptionHandler(VariantNotFoundException::class)
  fun variantNotFound(variantNotFoundException: VariantNotFoundException) {
    log.warn(
      "Variant not found", keyValue("variantId", variantNotFoundException.variantId),
      variantNotFoundException
    )
  }
  @ResponseStatus(value = HttpStatus.CONFLICT)
  @ExceptionHandler(InsufficientQuantityOnLocationException::class)
  fun variantQtyIsBig(insufficientQuantityOnLocationException: InsufficientQuantityOnLocationException) {
    log.warn(
      "Insufficient quantity at selected location",
      keyValue("locationId", insufficientQuantityOnLocationException.locationId),
      keyValue("locationQuantity", insufficientQuantityOnLocationException.locationQuantity),
      keyValue("requiredQuantity", insufficientQuantityOnLocationException.requiredQuantity),
      insufficientQuantityOnLocationException
    )
  }
  @ResponseStatus(value = HttpStatus.CONFLICT)
  @ExceptionHandler(InsufficientQuantityInPickList::class)
  fun insufficientQuantityInPickList(insufficientQuantityInPickList: InsufficientQuantityInPickList) {
    log.warn(
      "Picker has insufficient items for product in picklist",
      keyValue("pickerId", insufficientQuantityInPickList.pickerId),
      keyValue("locationId", insufficientQuantityInPickList.locationId),
      keyValue("variantId", insufficientQuantityInPickList.variantId),
      insufficientQuantityInPickList
    )
  }
}
