CREATE TABLE HisPJDetail (
  HisPJDetailID int(11) NOT NULL AUTO_INCREMENT,
  HisVersion varchar(32) DEFAULT NULL,
  PJDetailID int(11) NOT NULL,
  PJInfoID int(11) NOT NULL,
  EmployeeID int(11) NOT NULL,
  FlgPartner smallint(6) NOT NULL,
  PartnerName varchar(256) DEFAULT NULL,
  ObjYM char(6) DEFAULT NULL,
  ExpWH float(12, 4) DEFAULT NULL,
  FctWH float(12, 4) DEFAULT NULL,
  FlgAccount smallint(6) NOT NULL,
  Content varchar(512) DEFAULT NULL,
  Des varchar(512) DEFAULT NULL,
  FileID int(11) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (HisPJDetailID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;



CREATE TABLE HisWHExport (
  WHExportID int(11) NOT NULL AUTO_INCREMENT,
  OrgCD varchar(32) DEFAULT NULL,
  EmployeeID int(11) NOT NULL,
  PJInfoID int(11) NOT NULL,
  ObjDate varchar(8) DEFAULT NULL,
  Workhour float(12, 4) DEFAULT NULL,
  FlgExport int(11) DEFAULT NULL,
  FileID int(11) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (WHExportID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;



CREATE TABLE MstCalendar (
  CalendarID int(11) NOT NULL AUTO_INCREMENT,
  YMD char(8) DEFAULT NULL,
  Year int(11) DEFAULT NULL,
  Month int(11) DEFAULT NULL,
  Date int(11) DEFAULT NULL,
  WeekDate int(11) DEFAULT NULL,
  WeekNum int(11) DEFAULT NULL,
  DtDayType smallint(6) NOT NULL,
  Des varchar(512) DEFAULT NULL,
  PRIMARY KEY (CalendarID),
  UNIQUE INDEX UK_MstCalendar_YMD (YMD)
)
ENGINE = INNODB
AUTO_INCREMENT = 32
AVG_ROW_LENGTH = 528
CHARACTER SET utf8
COLLATE utf8_general_ci;



CREATE TABLE MstDictData (
  DictDataID int(11) NOT NULL AUTO_INCREMENT,
  ParentID int(11) NOT NULL,
  DictType varchar(32) NOT NULL,
  Value smallint(6) NOT NULL,
  Des varchar(256) DEFAULT NULL,
  ShowIndex int(11) DEFAULT NULL,
  Attr1 varchar(256) DEFAULT NULL,
  Attr2 varchar(256) DEFAULT NULL,
  Attr3 varchar(256) DEFAULT NULL,
  Attr4 varchar(256) DEFAULT NULL,
  Attr5 varchar(256) DEFAULT NULL,
  Config1 varchar(256) DEFAULT NULL,
  Config2 varchar(256) DEFAULT NULL,
  Config3 varchar(256) DEFAULT NULL,
  DisplayCN varchar(128) DEFAULT NULL,
  DisplayEN varchar(128) DEFAULT NULL,
  DisplayJP varchar(128) DEFAULT NULL,
  ExtCN varchar(128) DEFAULT NULL,
  ExtEN varchar(128) DEFAULT NULL,
  ExtJP varchar(128) DEFAULT NULL,
  PRIMARY KEY (DictDataID),
  INDEX IDX_MstDictData_DictType (DictType),
  INDEX IDX_MstDictData_TypeValue (DictType, Value)
)
ENGINE = INNODB
AUTO_INCREMENT = 197
AVG_ROW_LENGTH = 83
CHARACTER SET utf8
COLLATE utf8_general_ci;



CREATE TABLE MstDictType (
  DictType varchar(32) NOT NULL,
  Name varchar(128) DEFAULT NULL,
  FlgReserve smallint(6) NOT NULL,
  Des varchar(1024) DEFAULT NULL,
  PRIMARY KEY (DictType)
)
ENGINE = INNODB
AVG_ROW_LENGTH = 364
CHARACTER SET utf8
COLLATE utf8_general_ci;



CREATE TABLE MstFunction (
  FunctionCD varchar(64) NOT NULL,
  URL varchar(128) DEFAULT NULL,
  Name varchar(64) DEFAULT NULL,
  PRIMARY KEY (FunctionCD)
)
ENGINE = INNODB
AVG_ROW_LENGTH = 212
CHARACTER SET utf8
COLLATE utf8_general_ci;



CREATE TABLE MstMenu (
  MenuID int(11) NOT NULL AUTO_INCREMENT,
  FatherMenuID int(11) NOT NULL,
  MenuCD varchar(64) DEFAULT NULL,
  Level int(11) DEFAULT NULL,
  DisplayIndex int(11) DEFAULT NULL,
  URL varchar(128) DEFAULT NULL,
  FlgLeaf smallint(6) NOT NULL,
  Icon varchar(128) DEFAULT NULL,
  NameCN varchar(64) DEFAULT NULL,
  NameEN varchar(64) DEFAULT NULL,
  NameJP varchar(64) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (MenuID)
)
ENGINE = INNODB
AUTO_INCREMENT = 36
AVG_ROW_LENGTH = 468
CHARACTER SET utf8
COLLATE utf8_general_ci;


CREATE TABLE MstNationalVacation (
  NationalVacationID int(11) NOT NULL AUTO_INCREMENT,
  WYStart int(11) DEFAULT NULL,
  WYEnd int(11) DEFAULT NULL,
  Days int(11) DEFAULT NULL,
  FlgLaq smallint(6) NOT NULL,
  PRIMARY KEY (NationalVacationID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;


CREATE TABLE MstOrg (
  OrgID int(11) NOT NULL AUTO_INCREMENT,
  ParentID int(11) NOT NULL,
  FlgTopLevel smallint(6) NOT NULL,
  FlgLeaf smallint(6) NOT NULL,
  OrgLevel int(11) DEFAULT NULL,
  OrgCD varchar(64) DEFAULT NULL,
  NameCN varchar(256) DEFAULT NULL,
  NameEN varchar(256) DEFAULT NULL,
  NameJP varchar(256) DEFAULT NULL,
  SNameCN varchar(128) DEFAULT NULL,
  SNameEN varchar(128) DEFAULT NULL,
  SNameJP varchar(128) DEFAULT NULL,
  FlgCompany smallint(6) NOT NULL,
  FlgRevenueCenter smallint(6) NOT NULL,
  FlgCostCenter smallint(6) NOT NULL,
  FBranch smallint(6) NOT NULL,
  FDirectOrg smallint(6) NOT NULL,
  FlgSalesOrg smallint(6) NOT NULL,
  RegAddress varchar(512) DEFAULT NULL,
  OfficeAddr1 varchar(512) DEFAULT NULL,
  OfficeOrg2 varchar(512) DEFAULT NULL,
  UnProjectCD varchar(64) DEFAULT NULL,
  FlgAbort smallint(6) NOT NULL,
  UsefulFromDt char(8) DEFAULT NULL,
  UsefulToDt char(8) DEFAULT NULL,
  DisplayIndex varchar(32) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (OrgID)
)
ENGINE = INNODB
AUTO_INCREMENT = 113
AVG_ROW_LENGTH = 399
CHARACTER SET utf8
COLLATE utf8_general_ci;


CREATE TABLE MstPosition (
  PositionID int(11) NOT NULL AUTO_INCREMENT,
  FlgCanApprove smallint(6) NOT NULL,
  Level int(11) DEFAULT NULL,
  DisplayIndex int(11) DEFAULT NULL,
  NameCN varchar(128) DEFAULT NULL,
  NameEN varchar(128) DEFAULT NULL,
  NameJP varchar(128) DEFAULT NULL,
  SNameCN varchar(62) DEFAULT NULL,
  SNameEN varchar(64) DEFAULT NULL,
  SNameJP varchar(64) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (PositionID)
)
ENGINE = INNODB
AUTO_INCREMENT = 28
AVG_ROW_LENGTH = 963
CHARACTER SET utf8
COLLATE utf8_general_ci;


CREATE TABLE MstProxyAim (
  ProxyAimID int(11) NOT NULL AUTO_INCREMENT,
  ProxyInfoID int(11) NOT NULL,
  EmployeeID int(11) NOT NULL,
  PRIMARY KEY (ProxyAimID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;


CREATE TABLE MstProxyContent (
  ProxyContentID int(11) NOT NULL AUTO_INCREMENT,
  ProxyInfoID int(11) NOT NULL,
  WFStepID int(11) NOT NULL,
  PRIMARY KEY (ProxyContentID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;


CREATE TABLE MstProxyer (
  ProxyerID int(11) NOT NULL AUTO_INCREMENT,
  ProxyInfoID int(11) NOT NULL,
  AgentID int(11) NOT NULL,
  PRIMARY KEY (ProxyerID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;


CREATE TABLE MstProxyInfo (
  ProxyInfoID int(11) NOT NULL AUTO_INCREMENT,
  ClientID int(11) NOT NULL,
  Name varchar(64) DEFAULT NULL,
  FlgEnable smallint(6) NOT NULL,
  FlgShare smallint(6) NOT NULL,
  FromDt char(8) DEFAULT NULL,
  ToDt char(8) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (ProxyInfoID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;CREATE TABLE MstRole (
  RoleID int(11) NOT NULL AUTO_INCREMENT,
  NameCN varchar(64) DEFAULT NULL,
  NameEN varchar(64) DEFAULT NULL,
  NameJP varchar(64) DEFAULT NULL,
  ShowIndex int(11) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (RoleID)
)
ENGINE = INNODB
AUTO_INCREMENT = 10
AVG_ROW_LENGTH = 1820
CHARACTER SET utf8
COLLATE utf8_general_ci;




CREATE TABLE MstVacationSetting (
  VacationSettingID int(11) NOT NULL AUTO_INCREMENT,
  Name varchar(256) DEFAULT NULL,
  UsefulWH varchar(18) DEFAULT NULL,
  DayFrom char(8) DEFAULT NULL,
  DayTo char(8) DEFAULT NULL,
  TimeFrom char(4) DEFAULT NULL,
  TimeTo char(4) DEFAULT NULL,
  FlgCanChange smallint(6) NOT NULL,
  ApplyEndDate char(8) DEFAULT NULL,
  FlgWhole smallint(6) NOT NULL,
  FlgHalf smallint(6) NOT NULL,
  FlgEnable smallint(6) NOT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (VacationSettingID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;



CREATE TABLE MstWF (
  WFID int(11) NOT NULL AUTO_INCREMENT,
  WFVersionID int(11) NOT NULL,
  DWFType smallint(6) NOT NULL,
  Name varchar(256) DEFAULT NULL,
  WFCD varchar(32) DEFAULT NULL,
  TableName varchar(64) DEFAULT NULL,
  KeyName varchar(64) DEFAULT NULL,
  FlgMS smallint(6) NOT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (WFID)
)
ENGINE = INNODB
AUTO_INCREMENT = 4
AVG_ROW_LENGTH = 5461
CHARACTER SET utf8
COLLATE utf8_general_ci;



CREATE TABLE MstWFExt (
  WFExtID int AUTO_INCREMENT,
  WFVersionID int NOT NULL,
  WFID int NOT NULL,
  DWFType smallint NOT NULL,
  Name varchar(256),
  WFCD varchar(32),
  TableName varchar(64),
  KeyName varchar(64),
  FlgMS smallint NOT NULL,
  StartPositionID int,
  StartOrgCD varchar(64),
  PRIMARY KEY (WFExtID)
)
ENGINE = INNODB
CHARACTER SET utf8
COLLATE utf8_general_ci;CREATE TABLE MstWFStep(
    WFStepID          INT            AUTO_INCREMENT,
    WFExtID           INT            NOT NULL,
    RejectStepID      INT            NOT NULL,
    PrevStepID        INT            NOT NULL,
    NextStepID        INT            NOT NULL,
    StepName          VARCHAR(64),
    StepNo            INT,
    FlgApprove        SMALLINT       NOT NULL,
    FlgReject         SMALLINT       NOT NULL,
    FlgCreateStep     SMALLINT       NOT NULL,
    FlgApproveStep    SMALLINT       NOT NULL,
    FlgEndStep        SMALLINT       NOT NULL,
    PRIMARY KEY (WFStepID)
)
ENGINE = INNODB
CHARACTER SET utf8
COLLATE utf8_general_ci;
CREATE TABLE MstWFVersion (
  WFVersionID int(11) NOT NULL AUTO_INCREMENT,
  VersionName varchar(256) DEFAULT NULL,
  DtFrom char(8) DEFAULT NULL,
  DtTo char(8) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (WFVersionID)
)
ENGINE = INNODB
AUTO_INCREMENT = 2
AVG_ROW_LENGTH = 16384
CHARACTER SET utf8
COLLATE utf8_general_ci;



CREATE TABLE MstWHSetting (
  WHSettingID int(11) NOT NULL AUTO_INCREMENT,
  Name varchar(128) DEFAULT NULL,
  DtSettlementType smallint(6) NOT NULL DEFAULT 0,
  AMFrom char(4) DEFAULT NULL,
  AMTo char(4) DEFAULT NULL,
  MiddleFrom char(4) DEFAULT NULL,
  MiddleTo char(4) DEFAULT NULL,
  PMFrom char(4) DEFAULT NULL,
  PMTo char(4) DEFAULT NULL,
  AlarmWH float(12, 4) DEFAULT NULL,
  FlgEnable smallint(6) NOT NULL,
  FromDt char(8) DEFAULT NULL,
  ToDt char(8) DEFAULT NULL,
  OvertimeWHUnit float(12, 4) DEFAULT NULL,
  OvertimeStartWH float(12, 4) DEFAULT NULL,
  OvertimeDuration int(11) DEFAULT NULL,
  OvertimeStartTime char(4) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (WHSettingID)
)
ENGINE = INNODB
AUTO_INCREMENT = 2
AVG_ROW_LENGTH = 16384
CHARACTER SET utf8
COLLATE utf8_general_ci;CREATE TABLE MstWHSettingDetail (
  WHSettingDetailID int(11) NOT NULL AUTO_INCREMENT,
  WHSettingID int(11) NOT NULL,
  DtVacationType smallint(6) NOT NULL,
  MinUsedUnit float(12, 4) DEFAULT NULL,
  ApplyStartWH float(12, 4) DEFAULT NULL,
  FlgWhole smallint(6) NOT NULL,
  PRIMARY KEY (WHSettingDetailID)
)
ENGINE = INNODB
AUTO_INCREMENT = 4
AVG_ROW_LENGTH = 5461
CHARACTER SET utf8
COLLATE utf8_general_ci;


CREATE TABLE RtnEmployeeOrg (
  OrgEmployeeID int(11) NOT NULL AUTO_INCREMENT,
  EmployeeID int(11) NOT NULL,
  OrgCD varchar(64) DEFAULT NULL,
  PositionID int(11) NOT NULL,
  TitleCN varchar(128) DEFAULT NULL,
  TitleEN varchar(128) DEFAULT NULL,
  TitleJP varchar(128) DEFAULT NULL,
  ApproveEndDate date DEFAULT NULL,
  FlgApproveClose smallint(6) NOT NULL,
  MHRatio float(12, 4) DEFAULT NULL,
  FlgPart smallint(6) NOT NULL,
  FlgMainPeople smallint(6) NOT NULL,
  FlgNonProject smallint(6) NOT NULL,
  FlgAbort smallint(6) NOT NULL,
  UsefulFromDt char(8) DEFAULT NULL,
  UsefulToDt char(8) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (OrgEmployeeID)
)
ENGINE = INNODB
AUTO_INCREMENT = 10
AVG_ROW_LENGTH = 1820
CHARACTER SET utf8
COLLATE utf8_general_ci;CREATE TABLE RtnEmVacation (
  VacationSettingID int(11) NOT NULL,
  EmployeeID int(11) NOT NULL,
  LeftWH varchar(18) DEFAULT NULL,
  PRIMARY KEY (VacationSettingID, EmployeeID)
)
ENGINE = INNODB
CHARACTER SET utf8
COLLATE utf8_general_ci;CREATE TABLE RtnEmWH (
  WHSettingID int(11) NOT NULL,
  EmployeeID int(11) NOT NULL,
  DtFrom char(8) NOT NULL DEFAULT '',
  DtTo char(8) DEFAULT NULL,
  PRIMARY KEY (WHSettingID, EmployeeID, DtFrom)
)
ENGINE = INNODB
AVG_ROW_LENGTH = 5461
CHARACTER SET utf8
COLLATE utf8_general_ci;CREATE TABLE RtnOrgPosition (
  OrgCD varchar(64) NOT NULL,
  PositionID int NOT NULL
)
ENGINE = INNODB
AVG_ROW_LENGTH = 215
CHARACTER SET utf8
COLLATE utf8_general_ci;CREATE TABLE RtnRoleFunction (
  RoleID int(11) NOT NULL,
  FunctionCD varchar(64) NOT NULL,
  AccessLevel int(11) DEFAULT 0,
  AccessMethod int(11) DEFAULT NULL,
  PRIMARY KEY (RoleID, FunctionCD)
)
ENGINE = INNODB
AVG_ROW_LENGTH = 215
CHARACTER SET utf8
COLLATE utf8_general_ci;


CREATE TABLE RtnRoleMenu (
  MenuID int(11) NOT NULL,
  RoleID int(11) NOT NULL,
  PRIMARY KEY (MenuID, RoleID)
)
ENGINE = INNODB
AVG_ROW_LENGTH = 135
CHARACTER SET utf8
COLLATE utf8_general_ci;



CREATE TABLE RtnUserRole (
  RoleID int(11) NOT NULL,
  EmployeeID int(11) NOT NULL,
  PRIMARY KEY (RoleID, EmployeeID)
)
ENGINE = INNODB
AVG_ROW_LENGTH = 84
CHARACTER SET utf8
COLLATE utf8_general_ci;


CREATE TABLE RtnWFPosition(
    WFPositionID    INT            AUTO_INCREMENT,
    WFExtID         INT            NOT NULL,
    WFStepID        INT            NOT NULL,
    PositionID      INT            NOT NULL,
    OrgCD           VARCHAR(64),
    PRIMARY KEY (WFPositionID)
)
ENGINE = INNODB
CHARACTER SET utf8
COLLATE utf8_general_ci;




CREATE TABLE SysLog (
  SysLogID int(11) NOT NULL AUTO_INCREMENT,
  FunctionCD varchar(64) DEFAULT NULL,
  MenuCD varchar(64) DEFAULT NULL,
  OpertionTime datetime DEFAULT NULL,
  TableName varchar(64) DEFAULT NULL,
  TableKey varchar(64) DEFAULT NULL,
  Memo varchar(256) DEFAULT NULL,
  UserID int(11) DEFAULT NULL,
  PRIMARY KEY (SysLogID)
)
ENGINE = INNODB
AUTO_INCREMENT = 91
AVG_ROW_LENGTH = 182
CHARACTER SET utf8
COLLATE utf8_general_ci;

CREATE TABLE TmpFile (
  FileID int(11) NOT NULL AUTO_INCREMENT,
  FileToken varchar(64) NOT NULL,
  AttachmentName varchar(256) DEFAULT NULL,
  File varchar(512) DEFAULT NULL,
  FullPath varchar(512) DEFAULT NULL,
  FlgMain smallint(6) NOT NULL DEFAULT 0,
  FlgEncrypt smallint(6) NOT NULL DEFAULT 0,
  ShowIndex int(11) DEFAULT 0,
  PRIMARY KEY (FileID)
)
ENGINE = INNODB
AVG_ROW_LENGTH = 362
CHARACTER SET utf8
COLLATE utf8_general_ci;CREATE TABLE TmpWFPosition (
  WFPositionID int(11) NOT NULL AUTO_INCREMENT,
  WFID int(11) NOT NULL,
  PositionID int(11) NOT NULL,
  OrgCD varchar(64) DEFAULT NULL,
  OptIndex int(11) DEFAULT NULL,
  FlgNodeType smallint(6) NOT NULL,
  FlgOpt smallint(6) NOT NULL,
  PRIMARY KEY (WFPositionID)
)
ENGINE = INNODB
AUTO_INCREMENT = 14
AVG_ROW_LENGTH = 1365
CHARACTER SET utf8
COLLATE utf8_general_ci;



CREATE TABLE TrnEmBackground (
  EmBackgroundID int(11) NOT NULL AUTO_INCREMENT,
  EmployeeID int(11) NOT NULL,
  FromDt char(8) DEFAULT NULL,
  ToDt char(8) DEFAULT NULL,
  School varchar(512) DEFAULT NULL,
  Content varchar(1024) DEFAULT NULL,
  Certificate varchar(256) DEFAULT NULL,
  CertificateNo varchar(128) DEFAULT NULL,
  CertificateExpire varchar(64) DEFAULT NULL,
  DtEdu smallint(6) NOT NULL,
  DtDegree smallint(6) NOT NULL,
  DtLevel smallint(6) NOT NULL,
  Fee float(12, 4) DEFAULT NULL,
  DtEduFeeFrom smallint(6) NOT NULL,
  Des varchar(512) DEFAULT NULL,
  Memo varchar(512) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (EmBackgroundID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;CREATE TABLE TrnEmContract (
  EmContractID int(11) NOT NULL AUTO_INCREMENT,
  EmployeeID int(11) NOT NULL,
  ContractNo varchar(128) DEFAULT NULL,
  SignDate char(8) DEFAULT NULL,
  FlgExten smallint(6) NOT NULL,
  SignNum int(11) DEFAULT NULL,
  DtContractType smallint(6) NOT NULL,
  FromDt char(8) DEFAULT NULL,
  ToDt char(8) DEFAULT NULL,
  DtLevelType smallint(6) NOT NULL,
  DtLevel1 smallint(6) NOT NULL,
  DtLevel2 varchar(64) NOT NULL,
  FlgCurrent smallint(6) NOT NULL,
  SBasic varchar(64) DEFAULT NULL,
  SFunction varchar(64) DEFAULT NULL,
  SPosition varchar(64) NOT NULL,
  SForeigner varchar(64) DEFAULT NULL,
  Salary varchar(64) DEFAULT NULL,
  Compensation varchar(64) DEFAULT NULL,
  PaymentDate char(8) DEFAULT NULL,
  SAFood varchar(64) DEFAULT NULL,
  SATraffic varchar(64) DEFAULT NULL,
  JobContent varchar(1024) DEFAULT NULL,
  FileID int(11) DEFAULT NULL,
  Des varchar(512) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (EmContractID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;CREATE TABLE TrnEmExperience (
  EmExperienceID int(11) NOT NULL AUTO_INCREMENT,
  EmployeeID int(11) NOT NULL,
  FromDt char(8) DEFAULT NULL,
  ToDt char(8) DEFAULT NULL,
  Company varchar(256) DEFAULT NULL,
  DtJobType smallint(6) NOT NULL,
  Title varchar(128) DEFAULT NULL,
  Job varchar(1024) DEFAULT NULL,
  LeaveReason varchar(1024) DEFAULT NULL,
  Certifier varchar(64) DEFAULT NULL,
  CertifierContact varchar(512) DEFAULT NULL,
  Des varchar(512) DEFAULT NULL,
  Memo varchar(512) DEFAULT NULL,
  PRIMARY KEY (EmExperienceID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;CREATE TABLE TrnEmInsurance (
  EmInsuranceID int(11) NOT NULL AUTO_INCREMENT,
  EmployeeID int(11) NOT NULL,
  InsuranceBase varchar(64) DEFAULT NULL,
  InsuranceFrom char(8) DEFAULT NULL,
  HouseBase varchar(64) DEFAULT NULL,
  HouseFrom char(8) DEFAULT NULL,
  FileID int(11) DEFAULT NULL,
  PRIMARY KEY (EmInsuranceID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;CREATE TABLE TrnEmLanguage (
  EmLanguageID int(11) NOT NULL AUTO_INCREMENT,
  EmployeeID int(11) NOT NULL,
  DtLanguage smallint(6) DEFAULT NULL,
  DtLevel smallint(6) DEFAULT NULL,
  DtOralLevel smallint(6) DEFAULT NULL,
  DtWriteLevel smallint(6) DEFAULT NULL,
  DtLisenLevel smallint(6) DEFAULT NULL,
  Des varchar(512) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (EmLanguageID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;CREATE TABLE TrnEmployee (
  EmployeeID int(11) NOT NULL AUTO_INCREMENT,
  LoginName varchar(128) DEFAULT NULL,
  Pass varchar(256) DEFAULT NULL,
  LastLoginTime datetime DEFAULT NULL,
  LastLoginIP varchar(64) DEFAULT NULL,
  LoginNum int(11) DEFAULT NULL,
  FlgChangePassword smallint(6) DEFAULT 0,
  FlgEnable smallint(6) NOT NULL DEFAULT 1,
  EmployeeNo varchar(64) DEFAULT NULL,
  EmployeeCode varchar(64) DEFAULT NULL,
  FlgSpecialVacation smallint(6) NOT NULL,
  NameCN varchar(64) DEFAULT NULL,
  NameEN varchar(64) DEFAULT NULL,
  NameJP varchar(64) DEFAULT NULL,
  DtGender char(10) DEFAULT NULL,
  DtNation smallint(6) DEFAULT NULL,
  DtCulture char(10) DEFAULT NULL,
  Birthday char(8) DEFAULT NULL,
  DtRegisterType smallint(6) DEFAULT NULL,
  FlgHasResidence smallint(6) DEFAULT NULL,
  ResidenceNo char(10) DEFAULT NULL,
  ResidenceExpireDate date DEFAULT NULL,
  IDNo varchar(32) DEFAULT NULL,
  Passport varchar(32) DEFAULT NULL,
  Driver varchar(32) DEFAULT NULL,
  HomeAddr varchar(512) DEFAULT NULL,
  ZipCode varchar(8) DEFAULT NULL,
  FlgMarry smallint(6) DEFAULT NULL,
  DtWorkPlace smallint(6) DEFAULT NULL,
  DtEmployeeType smallint(6) DEFAULT NULL,
  DtFor smallint(6) DEFAULT NULL,
  ComeDate char(8) DEFAULT NULL,
  LeaveDate char(8) DEFAULT NULL,
  LeaveReason varchar(1024) DEFAULT NULL,
  FlgInJob smallint(6) DEFAULT 1,
  DtLevelType varchar(64) DEFAULT NULL,
  DtLevel1 varchar(64) DEFAULT NULL,
  DtLevel2 varchar(64) DEFAULT NULL,
  ServiceYear int(11) DEFAULT NULL,
  ContractNum int(11) DEFAULT NULL,
  ContractNo char(10) DEFAULT NULL,
  ContractFrom char(8) DEFAULT NULL,
  ContractTo char(8) DEFAULT NULL,
  FlgUnLimit smallint(6) DEFAULT 0,
  DtContractType smallint(6) DEFAULT 0,
  SBasic float(12, 4) DEFAULT NULL,
  SFunction float(12, 4) DEFAULT NULL,
  SPosition float(12, 4) DEFAULT NULL,
  SForeigner float(12, 4) DEFAULT NULL,
  STotal float(12, 4) DEFAULT NULL,
  POffice varchar(32) DEFAULT NULL,
  PMobile varchar(32) DEFAULT NULL,
  PGroup varchar(32) DEFAULT NULL,
  PEmail varchar(64) DEFAULT NULL,
  POther varchar(256) DEFAULT NULL,
  PUrgencyPeople varchar(64) DEFAULT NULL,
  PUrgencyRelation varchar(64) DEFAULT NULL,
  PUrgencyTel varchar(64) DEFAULT NULL,
  DtEdu smallint(6) DEFAULT NULL,
  DtDgree smallint(6) DEFAULT NULL,
  DtTechTitle smallint(6) DEFAULT NULL,
  School varchar(256) DEFAULT NULL,
  Depart varchar(128) DEFAULT NULL,
  DtEnglish smallint(6) DEFAULT NULL,
  DtJapanese smallint(6) DEFAULT NULL,
  Channel varchar(512) DEFAULT NULL,
  IMGFileID int(11) DEFAULT NULL,
  ResAddress varchar(512) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (EmployeeID)
)
ENGINE = INNODB
AUTO_INCREMENT = 156
AVG_ROW_LENGTH = 668
CHARACTER SET utf8
COLLATE utf8_general_ci;


CREATE TABLE TrnEmSalary (
  EmSalaryID int(11) NOT NULL AUTO_INCREMENT,
  EmployeeID int(11) NOT NULL,
  ObjYM char(6) DEFAULT NULL,
  PaymentDate char(8) DEFAULT NULL,
  SettleDate char(8) DEFAULT NULL,
  FlgBonusMonth smallint(6) NOT NULL,
  SBasic varchar(64) DEFAULT NULL,
  SFunction varchar(64) DEFAULT NULL,
  SPosition varchar(64) DEFAULT NULL,
  SForeigner varchar(64) DEFAULT NULL,
  STotal varchar(64) DEFAULT NULL,
  OTFee varchar(64) DEFAULT NULL,
  SATraffic varchar(64) DEFAULT NULL,
  SAFood varchar(64) DEFAULT NULL,
  Other varchar(64) DEFAULT NULL,
  SalaryBT varchar(64) DEFAULT NULL,
  LPfm varchar(64) DEFAULT NULL,
  LDpt varchar(64) DEFAULT NULL,
  LRecommend varchar(64) DEFAULT NULL,
  Other1 varchar(64) DEFAULT NULL,
  LAttendance varchar(64) DEFAULT NULL,
  LTotal varchar(64) DEFAULT NULL,
  LValue varchar(256) DEFAULT NULL,
  Salary varchar(64) DEFAULT NULL,
  PIAge varchar(64) DEFAULT NULL,
  PIHospital varchar(64) DEFAULT NULL,
  PIUnEm varchar(64) DEFAULT NULL,
  PIHurt varchar(64) DEFAULT NULL,
  PIBaby varchar(64) DEFAULT NULL,
  PIHouse varchar(64) DEFAULT NULL,
  PSocialTotal varchar(64) DEFAULT NULL,
  Tax varchar(64) DEFAULT NULL,
  YearAIFee varchar(64) DEFAULT NULL,
  TaxBasic varchar(64) DEFAULT NULL,
  TaxTarget varchar(64) DEFAULT NULL,
  TaxRatio varchar(64) DEFAULT NULL,
  TaxSub varchar(64) DEFAULT NULL,
  SalaryTax varchar(64) DEFAULT NULL,
  SalaryLeft varchar(64) DEFAULT NULL,
  NPfm varchar(64) DEFAULT NULL,
  NPfmDpt varchar(64) DEFAULT NULL,
  PfmCmp varchar(64) DEFAULT NULL,
  NDpt varchar(64) DEFAULT NULL,
  NRecommend varchar(64) DEFAULT NULL,
  Other2 varchar(64) DEFAULT NULL,
  AttendanceRate varchar(64) DEFAULT NULL,
  NTotal varchar(64) DEFAULT NULL,
  NValue varchar(256) DEFAULT NULL,
  TaxTargetYear varchar(64) DEFAULT NULL,
  TRatioYear varchar(64) DEFAULT NULL,
  TaxYear varchar(64) DEFAULT NULL,
  BYearLeft varchar(64) DEFAULT NULL,
  LeftMonth varchar(64) DEFAULT NULL,
  Remark varchar(256) DEFAULT NULL,
  TaxBonus varchar(64) DEFAULT NULL,
  TaxBunusTotal varchar(64) DEFAULT NULL,
  TaxB varchar(64) DEFAULT NULL,
  IncomeAct varchar(64) DEFAULT NULL,
  YearBeforeTax varchar(64) DEFAULT NULL,
  YearIncomingACT varchar(64) DEFAULT NULL,
  DtLevel1 smallint(6) NOT NULL,
  DtLevel2 varchar(64) NOT NULL,
  ManageFee varchar(64) DEFAULT NULL,
  FileID int(11) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (EmSalaryID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;


CREATE TABLE TrnEmVC (
  EmVCID int(11) NOT NULL AUTO_INCREMENT,
  VCFormID int(11) NOT NULL,
  EmployeeID int(11) NOT NULL,
  Name varchar(256) DEFAULT NULL,
  ApplyDate datetime DEFAULT NULL,
  DtVacationType smallint(6) NOT NULL,
  UsefulDays float(12, 4) DEFAULT NULL,
  VCUsedWH float(12, 4) DEFAULT NULL,
  FlgWhole smallint(6) NOT NULL,
  UsefulFromDt datetime DEFAULT NULL,
  UsefulToDt datetime DEFAULT NULL,
  DtAppStatus smallint(6) NOT NULL,
  Reason varchar(1024) DEFAULT NULL,
  ConfirmBy int(11) DEFAULT NULL,
  ConfirmTime datetime DEFAULT NULL,
  FileID int(11) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (EmVCID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;


CREATE TABLE TrnFile (
  FileID int(11) NOT NULL AUTO_INCREMENT,
  DtFileType smallint(6) NOT NULL,
  AttachmentName varchar(256) DEFAULT NULL,
  File varchar(512) DEFAULT NULL,
  FullPath varchar(512) DEFAULT NULL,
  TableKey int(11) DEFAULT NULL,
  TableName varchar(64) DEFAULT NULL,
  FlgMain smallint(6) NOT NULL,
  FlgEncrypt smallint(6) NOT NULL,
  ShowIndex int(11) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (FileID)
)
ENGINE = INNODB
AUTO_INCREMENT = 4
AVG_ROW_LENGTH = 5461
CHARACTER SET utf8
COLLATE utf8_general_ci;



CREATE TABLE TrnOVForm (
  OVFormID int(11) NOT NULL AUTO_INCREMENT,
  EmployeeID int(11) NOT NULL,
  ObjYMD char(8) DEFAULT NULL,
  OVWH float(12, 4) DEFAULT NULL,
  SubmitTime datetime DEFAULT NULL,
  DtAppStatus smallint(6) NOT NULL,
  UsedEndTime datetime DEFAULT NULL,
  ConfirmOVWH float(12, 4) DEFAULT NULL,
  ConfirmUseWH float(12, 4) DEFAULT NULL,
  RestUsedWH float(12, 4) DEFAULT NULL,
  SalaryUsedWH float(12, 4) DEFAULT NULL,
  FlgHR smallint(6) NOT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (OVFormID)
)
ENGINE = INNODB
AUTO_INCREMENT = 2
AVG_ROW_LENGTH = 16384
CHARACTER SET utf8
COLLATE utf8_general_ci;


CREATE TABLE TrnOVFormDetail (
  OVFormDetailID int(11) NOT NULL AUTO_INCREMENT,
  OVFormID int(11) NOT NULL,
  FromDt char(4) DEFAULT NULL,
  ToDt char(4) DEFAULT NULL,
  PJInfoID int(11) NOT NULL,
  OVWH float(12, 4) DEFAULT NULL,
  FlgOut smallint(6) NOT NULL,
  FlgPJG smallint(6) NOT NULL,
  Memo varchar(512) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (OVFormDetailID)
)
ENGINE = INNODB
AUTO_INCREMENT = 2
AVG_ROW_LENGTH = 16384
CHARACTER SET utf8
COLLATE utf8_general_ci;



CREATE TABLE TrnPaidVC (
  PaidVCID int(11) NOT NULL AUTO_INCREMENT,
  EmployeeID int(11) NOT NULL,
  DtAppStatus smallint(6) NOT NULL,
  GetDt char(4) DEFAULT NULL,
  DtPaidVCType smallint(6) NOT NULL,
  UsefulWH float(12, 4) DEFAULT NULL,
  UsefulFromDt char(8) DEFAULT NULL,
  UsefulEndDt char(8) DEFAULT NULL,
  RestUsedWH float(12, 4) DEFAULT NULL,
  FlgCarry smallint(6) NOT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (PaidVCID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;



CREATE TABLE TrnPJDetail (
  PJDetailID int(11) NOT NULL AUTO_INCREMENT,
  PJInfoID int(11) NOT NULL,
  EmployeeID int(11) NOT NULL,
  FlgPartner smallint(6) NOT NULL,
  PartnerName varchar(256) DEFAULT NULL,
  ObjYM char(6) DEFAULT NULL,
  ExpWH float(12, 4) DEFAULT NULL,
  FctWH float(12, 4) DEFAULT NULL,
  FlgAccount smallint(6) NOT NULL,
  Content varchar(512) DEFAULT NULL,
  Des varchar(512) DEFAULT NULL,
  FileID int(11) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (PJDetailID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;


CREATE TABLE TrnPJG (
  PJGID int(11) NOT NULL,
  Name varchar(512) DEFAULT NULL,
  PJGCode varchar(64) DEFAULT NULL,
  FlgFinish smallint(6) NOT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (PJGID)
)
ENGINE = INNODB
CHARACTER SET utf8
COLLATE utf8_general_ci;CREATE TABLE TrnPJInfo (
  PJInfoID int(11) NOT NULL AUTO_INCREMENT,
  PJGID int(11) NOT NULL,
  OrgCD varchar(64) DEFAULT NULL,
  PJNo varchar(64) DEFAULT NULL,
  Name varchar(256) DEFAULT NULL,
  SName varchar(64) DEFAULT NULL,
  ExpFromDt char(6) DEFAULT NULL,
  ExpToDt char(6) DEFAULT NULL,
  DtBudgetStatus smallint(6) NOT NULL,
  DtProjectStatus smallint(6) NOT NULL,
  FlgFinish smallint(6) NOT NULL,
  Des varchar(1024) DEFAULT NULL,
  PMID int(11) DEFAULT NULL,
  Memo varchar(512) DEFAULT NULL,
  FileID int(11) DEFAULT NULL,
  FlgUnProject smallint(6) NOT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (PJInfoID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;CREATE TABLE TrnPJPerson (
  PJPersonID int(11) NOT NULL AUTO_INCREMENT,
  PJInfoID int(11) NOT NULL,
  EmployeeID int(11) NOT NULL,
  FlgPartner smallint(6) NOT NULL,
  ParternName varchar(256) DEFAULT NULL,
  PRIMARY KEY (PJPersonID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;CREATE TABLE TrnRecord (
  RecordID int(11) NOT NULL AUTO_INCREMENT,
  EmployeeNo varchar(64) DEFAULT NULL,
  ObjDate char(8) DEFAULT NULL,
  InTime datetime DEFAULT NULL,
  OutTime datetime DEFAULT NULL,
  Duration float(12, 4) DEFAULT NULL,
  DtRecordType smallint(6) NOT NULL,
  DtOptStatus smallint(6) NOT NULL,
  InputTime datetime DEFAULT NULL,
  FileID int(11) DEFAULT NULL,
  PRIMARY KEY (RecordID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;CREATE TABLE TrnVCForm (
  VCFormID int(11) NOT NULL AUTO_INCREMENT,
  EmployeeID int(11) NOT NULL,
  ApplyDate char(8) DEFAULT NULL,
  SubmitTime datetime DEFAULT NULL,
  DtAppStatus smallint(6) NOT NULL,
  FileID int(11) DEFAULT NULL,
  VCDay float(12, 4) DEFAULT NULL,
  Memo varchar(512) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (VCFormID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;CREATE TABLE TrnVCFormDetail (
  VCFormDetailID int(11) NOT NULL AUTO_INCREMENT,
  VacationSettingID int(11) DEFAULT NULL,
  VCFormID int(11) NOT NULL,
  SplitNo int(11) DEFAULT NULL,
  ObjYMD char(8) DEFAULT NULL,
  VCFromDt char(4) DEFAULT NULL,
  VCToDt char(4) DEFAULT NULL,
  VCTime float(12, 4) DEFAULT NULL,
  DtVacationType smallint(6) NOT NULL,
  Des varchar(512) DEFAULT NULL,
  FlgHR smallint(6) NOT NULL,
  Memo varchar(512) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (VCFormDetailID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;

CREATE TABLE TrnVCOpt (
  VCOptID int(11) NOT NULL AUTO_INCREMENT,
  VCFormDetailID int(11) NOT NULL,
  VCFormID int(11) NOT NULL,
  UsedWH float(12, 4) DEFAULT NULL,
  DtWHFrom smallint(6) NOT NULL,
  TableName varchar(64) DEFAULT NULL,
  TableKey int(11) DEFAULT NULL,
  TableWHCol varchar(64) DEFAULT NULL,
  FlgRelease smallint(6) NOT NULL,
  Memo varchar(512) DEFAULT NULL,
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  UpdateTime timestamp NULL DEFAULT NULL,
  PRIMARY KEY (VCOptID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;

CREATE TABLE TrnWFDetail (
  WFDetailID int(11) NOT NULL AUTO_INCREMENT,
  WFStepBasicID int(11) NOT NULL,
  WFCD varchar(32) DEFAULT NULL,
  FlowName varchar(64) DEFAULT NULL,
  FlowNo int(11) DEFAULT NULL,
  CurrentWFStepID int(11) NOT NULL,
  RejectWFStepID int(11) NOT NULL,
  NextWFStepID int(11) NOT NULL,
  FlgApprove smallint(6) NOT NULL,
  FlgReject smallint(6) NOT NULL,
  DtWFStatus smallint(6) NOT NULL,
  OptID int(11) DEFAULT NULL,
  OptPositionID int(11) DEFAULT NULL,
  OptOrgCD varchar(64) DEFAULT NULL,
  OptTime datetime DEFAULT NULL,
  OpeDes varchar(512) DEFAULT NULL,
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  UpdateTime timestamp NULL DEFAULT NULL,
  PRIMARY KEY (WFDetailID)
)
ENGINE = INNODB
AUTO_INCREMENT = 4
AVG_ROW_LENGTH = 5461
CHARACTER SET utf8
COLLATE utf8_general_ci;

CREATE TABLE TrnWFProxy (
  WFProxyID int(11) NOT NULL AUTO_INCREMENT,
  WFDetailID int(11) NOT NULL,
  AgentID int(11) NOT NULL,
  ClientID int(11) DEFAULT NULL,
  PRIMARY KEY (WFProxyID)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;

CREATE TABLE TrnWFStepBasic (
  WFStepBasicID int(11) NOT NULL AUTO_INCREMENT,
  WFName varchar(64) DEFAULT NULL,
  WFCD varchar(32) DEFAULT NULL,
  DtWFStatus smallint(6) NOT NULL,
  DWFType smallint(6) NOT NULL DEFAULT 0,
  AppTableName varchar(64) DEFAULT NULL,
  AppKeyName varchar(64) DEFAULT NULL,
  AppKey int(11) DEFAULT NULL,
  AppEmID int(11) DEFAULT NULL,
  AppEmPositionID int(11) DEFAULT NULL,
  AppEmOrgCD varchar(64) DEFAULT NULL,
  AppSubmitTime datetime DEFAULT NULL,
  AppTime char(8) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (WFStepBasicID)
)
ENGINE = INNODB
AUTO_INCREMENT = 2
AVG_ROW_LENGTH = 16384
CHARACTER SET utf8
COLLATE utf8_general_ci;

CREATE TABLE TrnWHForm (
  WHFormID int(11) NOT NULL AUTO_INCREMENT,
  EmployeeID int(11) NOT NULL,
  ObjYMD char(8) DEFAULT NULL,
  AbsWH float(12, 4) DEFAULT NULL,
  SubmitTime datetime DEFAULT NULL,
  DtAppStatus smallint(6) NOT NULL,
  FlgBYD smallint(6) NOT NULL,
  BYDTime datetime DEFAULT NULL,
  BYDFileID int(11) DEFAULT NULL,
  FlgHR smallint(6) NOT NULL,
  HRTime datetime DEFAULT NULL,
  HREmID int(11) DEFAULT NULL,
  HRFileID int(11) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (WHFormID)
)
ENGINE = INNODB
AUTO_INCREMENT = 2
AVG_ROW_LENGTH = 16384
CHARACTER SET utf8
COLLATE utf8_general_ci;CREATE TABLE TrnWHFormDetail (
  WHFormDetailID int(11) NOT NULL AUTO_INCREMENT,
  WHFormID int(11) NOT NULL,
  FromDt char(4) DEFAULT NULL,
  ToDt char(4) DEFAULT NULL,
  PJInfoID int(11) NOT NULL,
  WH float(12, 4) DEFAULT NULL,
  FlgOut smallint(6) NOT NULL,
  FlgPJG smallint(6) NOT NULL,
  Memo varchar(512) DEFAULT NULL,
  DelFlg char(1) NOT NULL DEFAULT '0',
  CreateTime timestamp DEFAULT CURRENT_TIMESTAMP,
  CreateBy int(11) DEFAULT NULL,
  UpdateTime timestamp NULL DEFAULT NULL,
  UpdateBy int(11) DEFAULT NULL,
  PRIMARY KEY (WHFormDetailID)
)
ENGINE = INNODB
AUTO_INCREMENT = 2
AVG_ROW_LENGTH = 16384
CHARACTER SET utf8
COLLATE utf8_general_ci;



CREATE TABLE tmp_emsub (
  EmployeeID int(11) DEFAULT NULL,
  EmployeeCode varchar(64) DEFAULT NULL,
  EmployeeNo varchar(64) DEFAULT NULL,
  PositionID int(11) DEFAULT NULL,
  PosLevel int(11) DEFAULT NULL,
  FlgPart smallint(6) DEFAULT NULL,
  PosUsefulFromDt char(8) DEFAULT NULL,
  PosUsefulToDt char(8) DEFAULT NULL,
  OrgID int(11) DEFAULT NULL,
  OrgCD varchar(64) DEFAULT NULL,
  OrgLevel int(11) DEFAULT NULL,
  SEmployeeID int(11) DEFAULT NULL,
  SEmployeeCode varchar(64) DEFAULT NULL,
  SEmployeeNo varchar(64) DEFAULT NULL,
  SNameCN varchar(256) DEFAULT NULL,
  SNameEN varchar(256) DEFAULT NULL,
  SNameJP varchar(256) DEFAULT NULL,
  SOrgID int(11) DEFAULT NULL,
  SOrgCD varchar(64) DEFAULT NULL,
  SOrgLevel int(11) DEFAULT NULL,
  SOrgNameCN varchar(256) DEFAULT NULL,
  SOrgNameEN varchar(256) DEFAULT NULL,
  SOrgNameJP varchar(256) DEFAULT NULL,
  SPositionID int(11) DEFAULT NULL,
  SPosLevel int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
