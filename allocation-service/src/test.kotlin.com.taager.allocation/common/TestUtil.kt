package com.taager.allocation.common
import com.taager.allocation.sharedkernel.domain.models.Moment
import org.assertj.core.api.Assertions.assertThat
fun assertDateAlmostNow(dateTime: Moment) {
    assertThat(dateTime.value - Moment.now().value < 1000).isTrue
}