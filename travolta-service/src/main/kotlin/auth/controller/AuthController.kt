package com.taager.travolta.auth.controller
import com.taager.travolta.auth.controller.converter.AuthControllerDtoConverter
import com.taager.travolta.auth.service.AuthService
import com.taager.travolta.auth.service.HeartBeatService
import com.taager.travolta.auth.service.LoginErrorException
import com.taager.travolta.auth.service.LoginForbiddenException
import com.taager.travolta.common.security.UserHelper.Companion.getCurrentSession
import com.taager.travolta.openapi.api.AuthApi
import com.taager.travolta.openapi.model.UserSessionDto
import com.taager.travolta.openapi.model.UserCredentialsDto
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import net.logstash.logback.argument.StructuredArguments.keyValue
import org.springframework.web.bind.annotation.*
@RestController
class AuthController(
    val userCredentialsConverter: AuthControllerDtoConverter,
    val authService: AuthService,
    val heartBeatService: HeartBeatService
) : AuthApi {
    override fun login(userCredentialsDto: UserCredentialsDto): ResponseEntity<UserSessionDto> {
        val userCredentials = userCredentialsConverter.convert(userCredentialsDto)
        val userToken = authService.login(userCredentials)
        val accessTokenDto = userCredentialsConverter.convert(userToken)
        return ResponseEntity(accessTokenDto, HttpStatus.OK)
    }
    override fun logoff(): ResponseEntity<Unit> {
        val userSession = getCurrentSession()
        authService.logoff(userId = userSession.user.id)
        return ResponseEntity(HttpStatus.OK)
    }
    override fun heartbeat(): ResponseEntity<Unit> {
        val userSession = getCurrentSession()
        heartBeatService.markHeartbeat(userSession.user.id)
        return ResponseEntity(HttpStatus.OK)
    }
}
@RestControllerAdvice(basePackageClasses = [AuthController::class])
class AuthControllerAdvice {
    private val log = LoggerFactory.getLogger(AuthController::class.java)
    @ResponseStatus(value = HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(LoginForbiddenException::class)
    fun unauthorized(loginForbiddenException: LoginForbiddenException) {
        log.info("Unauthorized user login", loginForbiddenException)
        log.debug(
            "Unauthorized login attempt",
            keyValue("userName", loginForbiddenException.userName),
            loginForbiddenException
        )
    }
    @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(LoginErrorException::class)
    fun error(loginErrorException: LoginErrorException) {
        log.error(
            "Error encountered in login flow", loginErrorException)
    }
}
