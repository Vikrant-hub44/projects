import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { CommonService } from '../../shared/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageridesService, RideMaster, CoreEvalutionRider } from '../managerides.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { debug } from 'util';
@Component({
  selector: 'app-rideevalution',
  templateUrl: './rideevalution.component.html',
  styleUrls: ['./rideevalution.component.scss']
})
export class RideevalutionComponent implements OnInit {  
  RiderId: any;
  RiderMasterId: any;
  submitted = false;
  PreRideSBP: any;
  PreRideDBP: any;
  RiderRecipeDetailModel: [];
  isPreRideSBP = false;
  isPreRideDBP = false;
  runridebtn: boolean = false;
  isHide = true;
  totalRows: any;
  Spin = false;
  Angle = false;
  Rotation = false;
  RideData: RideMaster;
  CurrentRideUserDetail: any;
  name: any;
  FirstName: string;
  LastName: string;
  isRemove: boolean = false;
  hiddenddbtn: any;
  CurrentRiderId: any;
  isRedirectTosession = false;
  Dob: any;
  Gender: any;
  RideStartTime: any;
  RiderAdminId: any;
  RotIdDDL: any;
  rotationList: any;
  ridemasterId: any;
  ipAddress: any;
  isLast: boolean = false;
  deletebutton: 0;
  IEbrowser: boolean = false;
  MachineAssignedName: any;
  FromWeb: boolean = true;
  LoginId: any;
  AssignedTo: any;
  spinMessage: string = "Spin is required";
  isFlag: boolean = false;
  SpinList: any = ['0', '20', '40', '60']
  evalutionRide: FormGroup;
  EvalutionRideData: CoreEvalutionRider;
  selectedEvaluationAnge: "0";
  EvaluationCoreScrore: any;
  TotalTime: any;
  LeftTime: any;
  RightTime: any;
  AnteriorTime: any;
  PosteriorTime: any;
  MinTime: number;
  MaxTime: number;
  mutipler :number;
  constructor(private fb: FormBuilder,
    private manageridesService: ManageridesService,
    private commonService: CommonService,
    private router: Router, private activeRoute: ActivatedRoute,
    private toaster: ToastrService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        this.RiderId = params.get('id');
      }
    );
    this.initForm();
    this.getEvalutionListDetails();
    this.getCurrentRiderRecipeDetail();
  }
  private initForm() {
    this.evalutionRide = this.fb.group({
      CoreScore: new FormControl(null, Validators.required),
      EvalutionRidesAngleList: this.fb.array([])
    });
  }
  get CoreScore() { return this.evalutionRide.get('CoreScore'); }
  RideMaster = {
    PreRideSBP: '',
    PreRideDBP: '',
  };
  get EvalutionRidesAngleList(): FormArray {
    return this.evalutionRide.get('EvalutionRidesAngleList') as FormArray;
  }
  /*!
  * \brief   Get Evalution List
  * \details Function is used to get the list of Evaluation Rides
  * \author  Vikrant
  * \date    10 March 2020
  * \version 1.0
  */
  getEvalutionListDetails() {
    let current = this;
    this.EvalutionList.forEach(function (value) {
      let group = new FormGroup({
        Id: new FormControl(value.Id),
        Spin: new FormControl(value.Spin, Validators.required),
        Direction: new FormControl(value.Direction),
        Degree: new FormControl(value.Degree, Validators.required),
      });
      current.EvalutionRidesAngleList.push(group);
    });
  }
  /*!
  * \brief   Current Receipt Detail for Rider
  * \details Function is used to get the current Receipt Detail for Rider
  * \author  Vikrant
  * \date    11 March 2020
  * \version 1.0
  */
  getCurrentRiderRecipeDetail() {
    this.RiderAdminId = localStorage.getItem("RiderAdminid");
    this.manageridesService.getCurrentRiderRecipeDetail(this.RiderAdminId).subscribe((data: any) => {
      console.log('as', data);
      data.forEach(childObj => {
        this.name = childObj.name;
        this.FirstName = childObj.firstName;
        this.LastName = childObj.lastName;
        this.CurrentRiderId = childObj.riderId;
        this.Gender = childObj.gender;
        this.Dob = childObj.dob;
        this.AssignedTo = childObj.assignedTo;
        this.MachineAssignedName = childObj.machineName;
      });
    })
  }
  /*!
  * \brief   Save Ride
  * \details this list is used to show Direction for Evaluation Ride
  * \author  Vikrant
  * \date    11 March 2020
  * \version 1.0
  */
  EvalutionList = [
    { Id: 1, Spin: 0, Direction: 'Anterior', Degree: ''},
    { Id: 2, Spin: 0, Direction: 'Posterior', Degree: '' },
    { Id: 3, Spin:0, Direction: 'Right Lateral', Degree: ''},
    { Id: 4, Spin: 0, Direction: 'Left Lateral', Degree: '' }
  ];

  /*!
  * \brief   Save Ride
  * \details Function is used to save ride 
  * \author  Vikrant
  * \date    11 March 2020
  * \version 1.0
  */
  SaveRide() {
    if (this.evalutionRide.valid) {
      this.EvalutionRideData = new CoreEvalutionRider();
      this.EvalutionRideData.RiderId = this.RiderId;
      this.EvalutionRideData.CoreEvalutionRiderDetail = this.evalutionRide.value.EvalutionRidesAngleList;
      this.EvalutionRideData.CoreScore = this.evalutionRide.value.CoreScore;
      this.manageridesService.SaveEvaluation(this.EvalutionRideData, this.FromWeb)
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.toaster.success(result.responseMessage);
            this.router.navigate(['/rides/ride-info', this.RiderAdminId]);
            setTimeout(() => { }, 3000);
          }
          else {
            this.toaster.error(result.responseMessage);
          }
        });
    }
    else {
      this.commonService.validateAllFormFields(this.evalutionRide);
    }
  }
  numberOnly(event): boolean {
    this.Angle = false;
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  onAngleChange(event): string {
    console.log(event);
    console.log(this.selectedEvaluationAnge);
    //this.EvaluationCoreScrore = this.mutipler * this.TotalTime * (((this.MinTime / this.MaxTime) + (this.AnteriorTime / this.PosteriorTime)) / 2)
   // this.CoreScore.setValue(this.EvaluationCoreScrore);
    this.calculateEvalScore();
    return "";
  }
  calculateEvalScore() {
    debugger;
    let MaxCal = this.MaxTime;
    let PosteriorCal = this.PosteriorTime;

    if (typeof this.MaxTime == 'undefined' || this.MaxTime <= 0)
      MaxCal= 1;//to avoid divide error by 0

    if (typeof this.PosteriorTime == 'undefined' || this.PosteriorTime <= 0)
      PosteriorCal = 1;//to avoid divide error by 0

    this.EvaluationCoreScrore = this.mutipler * this.TotalTime * (((this.MinTime / MaxCal) + (this.AnteriorTime / PosteriorCal)) / 2)
    if (isNaN(this.EvaluationCoreScrore)) { this.EvaluationCoreScrore = "0"; }
    
    this.CoreScore.setValue(this.EvaluationCoreScrore.toFixed(2));
  }
  calculateScoreValues(event, i): string {
    debugger;
    let scoreTime = event.target.value;
    if (scoreTime == "") scoreTime = "0";
    //this.TotalTime += parseInt(scoreTime);


    if (this.selectedEvaluationAnge == "0")
      this.mutipler = 9;
    else if (this.selectedEvaluationAnge == "20")
      this.mutipler = 6;
    else if (this.selectedEvaluationAnge == "40")
      this.mutipler = 3;
    else if (this.selectedEvaluationAnge == "60")
      this.mutipler = 0;
    if (i == 0) {
      //Right
      this.AnteriorTime = scoreTime;
    }
    else if (i == 1) {
      //Right
      this.PosteriorTime = scoreTime;
    }
   else if (i == 2) { 
      //Right
      this.RightTime = scoreTime;
    }
    else if (i == 3) {
      //Left
      this.LeftTime = scoreTime;
    }
    this.TotalTime = parseInt(this.AnteriorTime) + parseInt(this.PosteriorTime) + parseInt(this.RightTime) + parseInt(this.LeftTime);

    this.MinTime = Math.min(this.RightTime, this.LeftTime);
    this.MaxTime = Math.max(this.RightTime, this.LeftTime);

   

    this.calculateEvalScore();

    return "";
  }
 
}
