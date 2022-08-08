import { Component, Input, OnInit } from '@angular/core';

import { GetFeatureFlagUsecase } from 'src/app/core/usecases/get-feature-flag.usecase';

import { FEATURE_FLAGS } from 'src/app/presentation/shared/constants';

@Component({

  selector: 'app-order-promotions',

  templateUrl: './order-promotions.component.html',

  styleUrls: ['./order-promotions.component.scss']

})

export class OrderPromotionsComponent implements OnInit {

  @Input() promotionEntitled: boolean;

  notPromotionEntitledText: string;

  promotionEntitledText: string;

  tooltipText: string;

  shippindDiscountPromotionFlag: boolean;

  constructor(

    private getFeatureFlagUseCase: GetFeatureFlagUsecase

    ) { }

  ngOnInit(): void {

    this.notPromotionEntitledText = 'طلبك غير مؤهل للشحن المجاني';

    this.promotionEntitledText = 'لقد حصلت علي شحن مجاني! سوق واربح أكتر';

    this.tooltipText = 'ﻟﺤﺼﻮﻟﻚ ﻋﻠﻲ اﻟﺸﺤﻦ اﻟﻤﺠﺎﻧﻲ ﻋﻠﻴﻚ اﺿﺎﻓﺔ ﻃﻠﺐ ﺳﻌﺮ ﻣﻨﺘﺠﺎﺗﻪ اﻟﺎﺻﻠﻲ اﻛﺜﺮ ﻣﻦ 350 ﺟﻨﻴﻪ ﻣﺼﺮي';

    this.getFeatureFlagUseCase.execute(FEATURE_FLAGS.SHIPPING_DISCOUNT_FLAG).subscribe((flag) => {

      this.shippindDiscountPromotionFlag = flag;

    });

  }

}
