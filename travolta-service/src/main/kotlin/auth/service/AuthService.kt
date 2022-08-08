qpackage com.taager.travolta.auth.service
import com.taager.travolta.auth.domain.UserCredentials
import com.taager.travolta.auth.domain.UserSession
import com.taager.travolta.auth.gateway.LoginGateway
import com.taager.travolta.common.featureflags.FeatureManager
import com.taager.travolta.common.reporting.useractions.UserActionPublisher
import com.taager.travolta.common.reporting.useractions.domain.UserLogin
import com.taager.travolta.common.reporting.useractions.domain.UserLogoff
import com.taager.travolta.common.security.UserSessionFactory
import org.springframework.stereotype.Service
@Service
class AuthService(
    private val loginGateway: LoginGateway,
    private val heartBeatService: HeartBeatService,
    private val userActionPublisher: UserActionPublisher,
    private val userSessionFactory: UserSessionFactory,
    private val featureManager: FeatureManager
) {
    fun login(userCredentials: UserCredentials): UserSession {
        val userToken = loginGateway.login(userCredentials)
        val userSession = userSessionFactory.buildFrom(userToken, userCredentials.warehouseCode)
        verifyUserSession(userSession)
        heartBeatService.markHeartbeat(userSession.user.id)
        userActionPublisher.publish(UserLogin(userId = userSession.user.id))
        return userSession
    }
    fun logoff(userId: String) {
        userActionPublisher.publish(UserLogoff(userId = userId))
    }
    private fun verifyUserSession(userSession: UserSession) {
        if (featureManager.isUserManagementEnabled(userSession.user.id) && !userSession.user.hasWarehouseGroup()) {
            throw UserMissingWarehouseGroupException()
        }
    }
}
