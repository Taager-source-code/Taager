package com.taager.travolta.common.controller
import com.taager.travolta.TravoltaServiceApplication
import com.taager.travolta.auth.service.UserMissingRequiredPrivilegeException
import com.taager.travolta.auth.service.UserMissingWarehouseGroupException
import com.taager.travolta.common.security.jwt.JwtMalformedException
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice
@RestControllerAdvice(basePackageClasses = [TravoltaServiceApplication::class])
class CommonControllerAdvice {
    private val log = LoggerFactory.getLogger(CommonControllerAdvice::class.java)
    @ResponseStatus(value = HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(JwtMalformedException::class)
    fun unauthorized(jwtMalformedException: JwtMalformedException) {
        log.warn("Unauthorized access", jwtMalformedException)
    }
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(UserMissingRequiredPrivilegeException::class)
    fun requiredPrivilegeNotFound(userMissingRequiredPrivilegeException: UserMissingRequiredPrivilegeException) {
        log.warn("Required privilege not found ", userMissingRequiredPrivilegeException)
    }
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(UserMissingWarehouseGroupException::class)
    fun warehouseGroupNotFound(userMissingWarehouseGroupException: UserMissingWarehouseGroupException) {
        log.warn("Warehouse group not found ", userMissingWarehouseGroupException)
    }
}
