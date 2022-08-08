package com.taager.travolta.auth.gateway.dto
import com.fasterxml.jackson.annotation.JsonProperty
data class UserCredentialsDto(@JsonProperty val username: String,
                              @JsonProperty val password: String)
