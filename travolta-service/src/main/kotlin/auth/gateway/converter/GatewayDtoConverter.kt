package com.taager.travolta.auth.gateway.converter
import com.taager.travolta.auth.domain.ExternaUserToken
import com.taager.travolta.auth.domain.UserCredentials
import com.taager.travolta.auth.gateway.dto.LoginResponseDto
import com.taager.travolta.auth.gateway.dto.UserCredentialsDto
import org.springframework.stereotype.Component
@Component
class GatewayDtoConverter {
    fun convert(loginResponseDto: LoginResponseDto): ExternaUserToken {
        return ExternaUserToken(
            accessToken = loginResponseDto.accessToken,
        )
    }
    fun convert(userCredentials: UserCredentials): UserCredentialsDto {
        return UserCredentialsDto(
            username = userCredentials.username,
            password = userCredentials.password
        )
    }
}
