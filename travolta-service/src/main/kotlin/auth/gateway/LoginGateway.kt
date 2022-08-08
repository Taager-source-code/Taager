package com.taager.travolta.auth.gateway
import com.taager.travolta.auth.domain.ExternaUserToken
import com.taager.travolta.auth.domain.UserCredentials
import com.taager.travolta.auth.gateway.converter.GatewayDtoConverter
import com.taager.travolta.auth.gateway.dto.LoginResponseDto
import com.taager.travolta.auth.gateway.dto.UserCredentialsDto
import com.taager.travolta.auth.service.LoginErrorException
import com.taager.travolta.auth.service.LoginForbiddenException
import net.logstash.logback.argument.StructuredArguments.keyValue
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST
@Component
class LoginGateway(
    val adminLoginGateway: AdminLoginGateway,
    val userCredentialsGatewayConverter: GatewayDtoConverter
) {
    private val log = LoggerFactory.getLogger(LoginGateway::class.java)
    fun login(userCredentials: UserCredentials): ExternaUserToken {
        val userCredentialsDto = userCredentialsGatewayConverter.convert(userCredentials)
        val call = adminLoginGateway.login(userCredentialsDto)
        val loginResponse = try {
            call.execute()
        } catch (ex: Exception) {
            throw LoginErrorException("General error", ex)
        }
        if (loginResponse.isSuccessful) {
            log.info(
                "successful login for user=${userCredentials.username}",
                keyValue("userName", userCredentials.username)
            )
            return userCredentialsGatewayConverter.convert(loginResponse.body()!!)
        } else if (loginResponse.code() in 400..499) {
            throw LoginForbiddenException(loginResponse.message(), userCredentials.username)
        } else {
            throw LoginErrorException(loginResponse.message())
        }
    }
}
interface LoginGatewayInternal {
    @POST("/api/auth/login")
    fun login(
        @Header("Authorization") apiToken: String,
        @Body userCredentialsDto: UserCredentialsDto
    ): Call<LoginResponseDto>
}
@Component
class AdminLoginGateway(
    val loginGatewayInternal: LoginGatewayInternal,
    @Value("\${admin.apiToken}") private val apiToken: String
) {
    fun login(userCredentialsDto: UserCredentialsDto): Call<LoginResponseDto> {
        return loginGatewayInternal.login(apiToken, userCredentialsDto)
    }
}
