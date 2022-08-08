package com.taager.allocation.allocator.queries.infrastructure.controllers
import com.taager.allocation.allocator.commands.domain.exceptions.InvalidDateFormatException
import com.taager.allocation.allocator.queries.application.usecases.GetOrderCount
import com.taager.allocation.allocator.queries.infrastructure.controllers.converters.GetOrderCountConverter
import com.taager.allocation.openapi.api.GetOrderCountApi
import com.taager.allocation.openapi.model.ErrorDto
import com.taager.allocation.openapi.model.OrdersCountDTO
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.time.LocalTime
@RestController
class GetOrderCountController(
    private val getOrderCount: GetOrderCount,
    private val converter: GetOrderCountConverter
) : GetOrderCountApi {
    override fun getOrderCount(
        status: String,
        fromDate: String?,
        toDate: String?
    ): ResponseEntity<OrdersCountDTO> {
        val orderCount = getOrderCount.execute(converter.convert(
            status = status,
            fromDate = fromDate,
            toDate = toDate
        ))
        return ResponseEntity(OrdersCountDTO(orderCount.count), HttpStatus.OK)
    }
}
@RestControllerAdvice(basePackageClasses = [GetOrderCountController::class])
class GetOrdersCountControllerAdvice {
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(InvalidDateFormatException::class)
    fun invalidDateInParams(invalidDateFormatException: InvalidDateFormatException): ResponseEntity<ErrorDto> {
        return ResponseEntity(
            ErrorDto(
                timestamp = LocalTime.now().toString(),
                message = invalidDateFormatException.message
            ),
            HttpStatus.BAD_REQUEST
        )
    }
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException::class)
    fun illegalArgumentInParams(illegalArgumentException: java.lang.IllegalArgumentException): ResponseEntity<ErrorDto> {
        return ResponseEntity(
            ErrorDto(
                timestamp = LocalTime.now().toString(),
                message = illegalArgumentException.message
            ),
            HttpStatus.BAD_REQUEST
        )
    }
}
