import { Component, OnInit, Inject } from '@angular/core';
// import { MydataserviceService } from '../mydataservice.service';
import { Profile, ProfileObj } from '../profile';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user';

import { switchMap, map, tap } from 'rxjs/operators';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatRadioChange, MatSlideToggleChange } from '@angular/material';

export interface DialogData {
  profile: Profile;
  freezedProfile: Profile;
  action: string;
}

// PSG-GATE-OFFICER
// PSG-DATA-OFFICER
// HRMO-DATA-OFFICER
// PSG-CISS-MANAGER

@Component({
  selector: 'app-access-approval-dialog',
  templateUrl: './access-approval-dialog.component.html',
  styleUrls: ['./access-approval-dialog.component.css']
})
export class AccessApprovalDialogComponent implements OnInit {
  oneColor = 'accent';
  oneChecked = false;
  oneDisabled = false;

  twoColor = 'accent';
  twoChecked = false;
  twoDisabled = false;

  threeColor = 'accent';
  threeChecked = false;
  threeDisabled = false;

  fourColor = 'accent';
  fourChecked = false;
  fourDisabled = false;

  passingThroughChecked = false;
  rankAndFileChecked = false;
  officialChecked = false;
  uniformedPersonnelChecked = false;
  uniformedOfficialChecked = false;
  customizedChecked = false;

  // public user$: Observable<User>;
  public user: User;

  public today = new Date();

  constructor(
    public dialogRef: MatDialogRef<AccessApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private authService: AuthService) { }

  onNoClick(): void {
    this.data.action = 'Cancelled';
    this.dialogRef.close();
  }

  isChecked(code): boolean {
    switch (code) {
      case 'notSelected':
        return false;
        case 'selected':
        return true;
      }
  }

  isSelected(codeBool): string {
    switch (codeBool) {
      case false:
        return 'notSelected';
        case true:
        return 'selected';
      }
  }

  getAccess(one, two, three, four): string {
    const a = ['', one, two, three, four];
    let access: string;
    access = '';
    for (let i = 1; i < 5; i++) {
      access = access + this.getCode(a[i], i.toString());
    }
    return access;
  }

  getCode(value, code): string {
    switch (value) {
      case 'notSelected':
        return '';
        case 'selected':
        return `Code ${code} ` ;
      }
  }

  // tiles

  getTileColor(tile) {
    switch (tile) {
      case 'One':
        return 'lightblue';
        case 'Two':
        return 'lightgreen';
        case 'Three':
        return '#DDBDF1';
        case 'Four':
        return '#DDBDF1';
      }
  }

  getTileAccess(access, tile) {
    switch (access) {
      case 'selected':
        return this.getTileColor(tile);
      case 'notSelected':
        return '#e6e6e6';
      default:
        return '#e6e6e6';
    }
  }

  // GET BACKGROUND COLOR

  getColor(status) {
    switch (status) {
      case 'ACTIVE':
        return '#1B5E20';
      case 'INACTIVE':
        return '#E91E63';
      default:
        return '#E8EAF6';
    }
  }

  async ngOnInit() {
    try {
      this.data.profile = new ProfileObj(this.unfreezeProfile(this.data.profile));
      await this.authService.getProfile()
        .subscribe((user) => {
          this.user = user;
          // get profile values
          this.checkAccessOption(this.data.profile.personaccesslevel);
          // disable toggles
          this.disableToggles(this.data.profile.personaccesslevel);
          // check toggles. important: must check toggles after checkAccessOption
          this.oneChecked = this.isChecked(this.data.profile.proviaccess.one);
          this.twoChecked = this.isChecked(this.data.profile.proviaccess.two);
          this.threeChecked = this.isChecked(this.data.profile.proviaccess.three);
          this.fourChecked = this.isChecked(this.data.profile.proviaccess.four);
        });
    } catch (error) {
      this.authService.log(error);
    }
  }

  checkAccessOption(level) {
    switch (level) {
      case 'PASSING THROUGH':
        this.passingThroughChecked = true;
        break;
      case 'RANK AND FILE':
        this.rankAndFileChecked = true;
        break;
      case 'OFFICIAL':
        this.officialChecked = true;
        break;
      case 'UNIFORMED PERSONNEL':
        this.uniformedPersonnelChecked = true;
        break;
      case 'UNIFORMED OFFICIAL':
        this.uniformedOfficialChecked = true;
        break;
      case 'CUSTOMIZED':
        this.customizedChecked = true;
        break;
      default:
        break;
    }
  }

  optionButtonChanged(event: MatRadioChange) {
    this.data.profile.personaccesslevel = event.value;
    this.disableToggles(event.value);
    this.checkToggles(event.value);
  }

  disableToggles(level) {
    if (level === 'CUSTOMIZED') {
      this.disableSet(false, false, false, false);
    } else {
      this.disableSet(true, true, true, true);
    }
  }

  disableSet(one, two, three, four) {
    this.oneDisabled = one;
    this.twoDisabled = two;
    this.threeDisabled = three;
    this.fourDisabled = four;
  }

  // check toggles here
  // PASSING THROUGH ( visitors & residents ) ( none selected)
  // RANK AND FILE ( two is selected )
  // OFFICIAL ( one & two is selected )
  // UNIFORMED PERSONNEL ( two & four is selected )
  // UNIFORMED OFFICIAL ( all options are selected )
  // CUSTOMIZED ( custom selection )
  checkToggles(level) {
    switch (level) {
      case 'PASSING THROUGH':
        this.checkSet(false, false, false, false);
        break;
      case 'RANK AND FILE':
        this.checkSet(false, true, false, false);
        break;
      case 'OFFICIAL':
        this.checkSet(true, true, false, false);
        break;
      case 'UNIFORMED PERSONNEL':
        this.checkSet(false, true, false, true);
        break;
      case 'UNIFORMED OFFICIAL':
        this.checkSet(true, true, true, true);
        break;
      case 'CUSTOMIZED':
        this.checkSet(false, false, false, false);
        break;
      default:
        break;
    }
  }

  checkSet(one, two, three, four) {
    this.oneChecked = one;
    this.twoChecked = two;
    this.threeChecked = three;
    this.fourChecked = four;
    this.data.profile.proviaccess.one = this.isSelected(one);
    this.data.profile.proviaccess.two = this.isSelected(two);
    this.data.profile.proviaccess.three = this.isSelected(three);
    this.data.profile.proviaccess.four = this.isSelected(four);
  }

  slideToggleOneChanged(event: MatSlideToggleChange) {
    this.oneChecked = event.checked;
    this.data.profile.proviaccess.one = this.isSelected(event.checked);
  }

  slideToggleTwoChanged(event: MatSlideToggleChange) {
    this.twoChecked = event.checked;
    this.data.profile.proviaccess.two = this.isSelected(event.checked);
  }

  slideToggleThreeChanged(event: MatSlideToggleChange) {
    this.threeChecked = event.checked;
    this.data.profile.proviaccess.three = this.isSelected(event.checked);
  }

  slideToggleFourChanged(event: MatSlideToggleChange) {
    this.fourChecked = event.checked;
    this.data.profile.proviaccess.four = this.isSelected(event.checked);
  }

  onButtonClick(action) {
    this.data.action = action;
  }

  unfreezeProfile(p: Profile): Profile {

    // deconstruct then set to this.profile
    const {
      _id,
      profileid,
      mobile,
      email,
      name,
      distinction,
      personaccesslevel,
      recordstatus,
      cisscode,
      cissinqtext,
      cisstoken,
      photothumbnailurl,
      employee,
      resident,
      visitor,
      datecreated,
      dateupdated,
      two_factor_temp_secret,
      two_factor_secret,
      two_factor_enabled,
      score,
      access,
      proviaccess,
      gender,
      nextstep,
      accessapproval,
      accessdatetagged,
      blacklisted,
    } = p;

    const profile: Profile = <Profile> {
      _id: _id,
      profileid: profileid,
      mobile: mobile,
      email: email,
      name: {
        first: name.first,
        middle: name.middle,
        last: name.last
      },
      distinction: distinction,
      personaccesslevel: personaccesslevel,
      recordstatus: recordstatus,
      cisscode: cisscode,
      cissinqtext: cissinqtext,
      cisstoken: cisstoken,
      photothumbnailurl: photothumbnailurl,
      employee: employee !== undefined ? {
        position: employee.position,
        office: employee.office
      } : {},
      resident: resident !== undefined ? {
        city: resident.city,
        district: resident.district,
        barangay: resident.barangay
      } : {},
      visitor: visitor !== undefined ? {
        visitorid: visitor.visitorid,
        visitorcompany: visitor.visitorcompany,
        persontovisit: visitor.persontovisit,
        visitorpurpose: visitor.visitorpurpose,
        visitordestination: visitor.visitordestination,
        timeofappointment: visitor.timeofappointment,
        visitstatus: visitor.visitstatus
      } : {},
      datecreated: datecreated,
      dateupdated: dateupdated,
      two_factor_temp_secret: two_factor_temp_secret,
      two_factor_secret: two_factor_secret,
      two_factor_enabled: two_factor_enabled,
      score: score,
      access: {
        one: access.one,
        two: access.two,
        three: access.three,
        four: access.four,
        colorone: access.colorone,
        colortwo: access.colortwo,
        colorthree: access.colorthree,
        colorfour: access.colorfour
      },
      proviaccess: {
        one: proviaccess.one,
        two: proviaccess.two,
        three: proviaccess.three,
        four: proviaccess.four,
        colorone: proviaccess.colorone,
        colortwo: proviaccess.colortwo,
        colorthree: proviaccess.colorthree,
        colorfour: proviaccess.colorfour
      },
      gender: gender,
      nextstep: nextstep,
      accessapproval: accessapproval,
      accessdatetagged: accessdatetagged,
      blacklisted: blacklisted
    };
    return profile;
  }

}
