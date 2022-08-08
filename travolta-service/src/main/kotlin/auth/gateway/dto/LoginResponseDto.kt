package com.taager.travolta.auth.gateway.dto
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
@JsonIgnoreProperties(ignoreUnknown = true)
class LoginResponseDto(@JsonProperty("data") val accessToken: String, @JsonProperty("user") val user: UserDto)
@JsonIgnoreProperties(ignoreUnknown = true)
class UserDto(@JsonProperty("_id") val id : String)
