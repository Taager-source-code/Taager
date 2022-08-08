package com.taager.travolta.common.usermanagement
import com.taager.travolta.auth.domain.UserSession
import com.taager.travolta.auth.service.UserMissingRequiredPrivilegeException
import com.taager.travolta.common.featureflags.FeatureManager
import com.taager.travolta.common.security.UserHelper.Companion.getCurrentSession
import org.springframework.stereotype.Component
import org.springframework.web.method.HandlerMethod
import org.springframework.web.servlet.HandlerInterceptor
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
@Component
class RequiredPrivilegeInterceptor(private val featureManager: FeatureManager) : HandlerInterceptor {
    override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {
        return if (handler is HandlerMethod) {
            val requiredRole = handler.method.getAnnotation(RequiredPrivilege::class.java) ?: return true
            val userSession = getCurrentSession()
            val requiredPrivileges = requiredRole.oneOf.toList()
            if (featureFlagDisabled(userSession) ||
                userSession.user.hasAllPrivileges() ||
                userSession.user.hasAnyPrivilege(requiredPrivileges)
            ) {
                return true
            } else {
                throw UserMissingRequiredPrivilegeException(requiredPrivileges, userSession.user.privileges.toList())
            }
        } else {
            true
        }
    }
    private fun featureFlagDisabled(userSession: UserSession) =
        !featureManager.isUserManagementEnabled(userSession.user.id)
}
