import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { WarehouseService } from "../../services/warehouse.service";
import {
  RequestStatus,
  ShippingCompany,
  ShippingStatus,
} from "../../../shared/interfaces/shipping";
import * as moment from "moment";
@Component({
  selector: "app-generate-pick-list-dialog",
  templateUrl: "./generate-pick-list-dialog.component.html",
  styleUrls: ["./generate-pick-list-dialog.component.scss"],
})
export class GeneratePickListDialogComponent implements OnInit {
  generatePickListForm = new FormGroup({
    status: new FormControl(null, Validators.required),
    shippingCompany: new FormControl(null, Validators.required),
    confirmationDate: new FormGroup({
      from: new FormControl(null, Validators.required),
      to: new FormControl(null, Validators.required),
    }),
  });
  requestStatus: string;
  shippingCompanies: ShippingCompany[] = [];
  shippingStatuses: ShippingStatus[] = [];
  sentOrdersCount: number;
  constructor(private warehouseService: WarehouseService) {}
  ngOnInit(): void {
    this.initializeShippingCompanies();
    this.initializeShippingStatuses();
    this.requestStatus = RequestStatus.NotTriggered;
    this.sentOrdersCount = 0;
  }
  initializeShippingCompanies(): void {
    this.shippingCompanies = [
      { companyName: "Bosta", value: "bosta" },
      { companyName: "Aramex", value: "aramex" },
      { companyName: "VHubs", value: "vhubs" },
      { companyName: "Other", value: "other" },
    ];
  }
  initializeShippingStatuses(): void {
    this.shippingStatuses = [
      { status: "Confirmed", value: "confirmed" },
      { status: "Delayed", value: "delayed" },
      { status: "Pending Shipping Company", value: "pending_shipping_company" },
    ];
  }
  onGenerate(): void {
    const requestBody = {
      ...this.generatePickListForm.value,
      confirmationDate: {
        from: moment(this.generatePickListForm.value.confirmationDate.from)
          .startOf("day")
          .toISOString(),
        to: moment(this.generatePickListForm.value.confirmationDate.to)
          .endOf("day")
          .toISOString(),
      },
    };
    this.sentOrdersCount = 0;
    this.requestStatus = RequestStatus.Processing;
    this.warehouseService.generatePickList(requestBody).subscribe(
      (res) => {
        this.requestStatus = RequestStatus.Success;
        this.sentOrdersCount = res.orderIDs.length;
      },
      () => {
        this.requestStatus = RequestStatus.Failed;
      }
    );
  }
}
