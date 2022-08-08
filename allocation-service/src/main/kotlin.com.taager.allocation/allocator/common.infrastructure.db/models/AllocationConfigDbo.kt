package com.taager.allocation.allocator.common.infrastructure.db.models
import com.taager.allocation.allocator.common.infrastructure.db.enums.AllocationConfigStatus
import com.vladmihalcea.hibernate.type.basic.PostgreSQLEnumType
import org.hibernate.annotations.Type
import org.hibernate.annotations.TypeDef
import java.sql.Timestamp
import java.util.*
import javax.persistence.*
@Entity
@Table(name = "allocation_config")
@TypeDef(
    name = "pgsql_enum",
    typeClass = PostgreSQLEnumType::class
)
class AllocationConfigDbo(
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    val id: UUID,
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "allocation_config_status", length = 255)
    @Type( type = "pgsql_enum" )
    val status: AllocationConfigStatus,
    @Column(name = "last_run")
    val lastRun: Timestamp
)