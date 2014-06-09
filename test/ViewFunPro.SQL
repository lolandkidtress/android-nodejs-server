USE ivggs_whs;
DROP VIEW ivggs_whs.VW_CommitWFInfo CASCADE;
CREATE
VIEW ivggs_whs.VW_CommitWFInfo
AS
SELECT
  `a`.`WFVersionID` AS `WFVersionID`,
  `b`.`WFExtID` AS `WFExtID`,
  `b`.`TableName` AS `TableName`,
  `b`.`KeyName` AS `KeyName`,
  `a`.`DtFrom` AS `DtFrom`,
  `a`.`DtTo` AS `DtTo`,
  `c`.`WFStepID` AS `WFStepID`,
  `c`.`RejectStepID` AS `RejectStepID`,
  `c`.`PrevStepID` AS `PrevStepID`,
  `c`.`NextStepID` AS `NextStepID`,
  `c`.`FlgApprove` AS `FlgApprove`,
  `c`.`FlgReject` AS `FlgReject`,
  `c`.`FlgCreateStep` AS `FlgCreateStep`,
  `c`.`FlgApproveStep` AS `FlgApproveStep`,
  `c`.`FlgEndStep` AS `FlgEndStep`,
  `d`.`PositionID` AS `PositionID`,
  `d`.`OrgCD` AS `OrgCD`,
  `b`.`DWFType` AS `DWFType`
FROM (((`MstWFVersion` `a`
  JOIN `MstWFExt` `b`)
  JOIN `MstWFStep` `c`)
  JOIN `RtnWFPosition` `d`)
WHERE ((`a`.`WFVersionID` = `b`.`WFVersionID`) AND (`b`.`WFExtID` = `c`.`WFExtID`) AND (`b`.`WFExtID` = `d`.`WFExtID`) AND (`c`.`WFStepID` = `d`.`WFStepID`) AND (`a`.`DelFlg` = '0') AND (`c`.`FlgCreateStep` = 1));USE ivggs_whs;
DROP VIEW ivggs_whs.VW_ConfirmWFInfo CASCADE;
CREATE
VIEW ivggs_whs.VW_ConfirmWFInfo
AS
SELECT
  `a`.`WFVersionID` AS `WFVersionID`,
  `b`.`WFExtID` AS `WFExtID`,
  `b`.`TableName` AS `TableName`,
  `b`.`KeyName` AS `KeyName`,
  `a`.`DtFrom` AS `DtFrom`,
  `a`.`DtTo` AS `DtTo`,
  `c`.`WFStepID` AS `WFStepID`,
  `c`.`RejectStepID` AS `RejectStepID`,
  `c`.`PrevStepID` AS `PrevStepID`,
  `c`.`NextStepID` AS `NextStepID`,
  `c`.`FlgApprove` AS `FlgApprove`,
  `c`.`FlgReject` AS `FlgReject`,
  `c`.`FlgCreateStep` AS `FlgCreateStep`,
  `c`.`FlgApproveStep` AS `FlgApproveStep`,
  `c`.`FlgEndStep` AS `FlgEndStep`,
  `d`.`PositionID` AS `PositionID`,
  `d`.`OrgCD` AS `OrgCD`,
  `b`.`DWFType` AS `DWFType`
FROM (((`MstWFVersion` `a`
  JOIN `MstWFExt` `b`)
  JOIN `MstWFStep` `c`)
  JOIN `RtnWFPosition` `d`)
WHERE ((`a`.`WFVersionID` = `b`.`WFVersionID`) AND (`b`.`WFExtID` = `c`.`WFExtID`) AND (`b`.`WFExtID` = `d`.`WFExtID`) AND (`c`.`WFStepID` = `d`.`WFStepID`) AND (`a`.`DelFlg` = '0') AND (`c`.`FlgApproveStep` = 1));USE ivggs_whs;
DROP VIEW ivggs_whs.VW_EmployeeInfo CASCADE;
CREATE
VIEW ivggs_whs.VW_EmployeeInfo
AS
SELECT
  `a`.`EmployeeID` AS `EmployeeID`,
  `a`.`EmployeeNo` AS `EmployeeNo`,
  `a`.`LoginName` AS `LoginName`,
  `a`.`NameCN` AS `EmployeeName`,
  `c`.`RoleID` AS `RoleID`,
  `c`.`NameCN` AS `RoleName`,
  `e`.`MenuID` AS `MenuID`,
  `e`.`MenuCD` AS `MenuCD`,
  `e`.`NameCN` AS `MenuName`,
  `e`.`URL` AS `MenuURL`,
  `g`.`FunctionCD` AS `FunctionCD`,
  `g`.`Name` AS `FunctionName`,
  `g`.`URL` AS `FunctionURL`,
  `f`.`AccessLevel` AS `AccessLevel`,
  `f`.`AccessMethod` AS `AccessMethod`
FROM ((((((`TrnEmployee` `a`
  LEFT JOIN `RtnUserRole` `b`
    ON ((`a`.`EmployeeID` = `b`.`EmployeeID`)))
  LEFT JOIN `MstRole` `c`
    ON ((`b`.`RoleID` = `c`.`RoleID`)))
  LEFT JOIN `RtnRoleMenu` `d`
    ON ((`b`.`RoleID` = `d`.`RoleID`)))
  LEFT JOIN `MstMenu` `e`
    ON ((`d`.`MenuID` = `e`.`MenuID`)))
  LEFT JOIN `RtnRoleFunction` `f`
    ON ((`b`.`RoleID` = `f`.`RoleID`)))
  LEFT JOIN `MstFunction` `g`
    ON ((`f`.`FunctionCD` = `g`.`FunctionCD`)))
ORDER BY `a`.`EmployeeID`, `b`.`RoleID`, `e`.`MenuID`, `g`.`FunctionCD`;USE ivggs_whs;
DROP VIEW ivggs_whs.VW_ProxyInfo CASCADE;
CREATE
VIEW ivggs_whs.VW_ProxyInfo
AS
SELECT
  `a`.`ProxyInfoID` AS `ProxyInfoID`,
  `a`.`ClientID` AS `ClientID`,
  `a`.`FlgShare` AS `FlgShare`,
  `a`.`FromDt` AS `FromDt`,
  `a`.`ToDt` AS `ToDt`,
  `b`.`WFStepID` AS `WFStepID`,
  `c`.`AgentID` AS `AgentID`,
  `d`.`EmployeeID` AS `EmployeeID`
FROM (((`MstProxyInfo` `a`
  JOIN `MstProxyContent` `b`)
  JOIN `MstProxyer` `c`)
  JOIN `MstProxyAim` `d`)
WHERE ((`a`.`ProxyInfoID` = `b`.`ProxyInfoID`) AND (`a`.`ProxyInfoID` = `c`.`ProxyInfoID`) AND (`a`.`ProxyInfoID` = `d`.`ProxyInfoID`) AND (`a`.`DelFlg` = '0') AND (`a`.`FlgEnable` = 1));USE ivggs_whs;
DROP VIEW ivggs_whs.VW_RoleFunction CASCADE;
CREATE
VIEW ivggs_whs.VW_RoleFunction
AS
SELECT
  `c`.`RoleID` AS `RoleID`,
  `c`.`NameCN` AS `RoleNameCN`,
  `a`.`FunctionCD` AS `FunctionCD`,
  `a`.`Name` AS `FunctionName`,
  `b`.`AccessLevel` AS `AccessLevel`,
  `b`.`AccessMethod` AS `AccessMethod`
FROM ((`MstFunction` `a`
  JOIN `RtnRoleFunction` `b`)
  JOIN `MstRole` `c`)
WHERE ((`a`.`FunctionCD` = `b`.`FunctionCD`) AND (`b`.`RoleID` = `c`.`RoleID`));USE ivggs_whs;
DROP VIEW ivggs_whs.VW_RoleMenu CASCADE;
CREATE
VIEW ivggs_whs.VW_RoleMenu
AS
SELECT
  `a`.`RoleID` AS `RoleID`,
  `c`.`MenuID` AS `MenuID`,
  `a`.`NameCN` AS `RoleNameCN`,
  `c`.`NameCN` AS `MenuNameCN`,
  `c`.`Level` AS `MenuLevel`,
  `c`.`MenuCD` AS `MenuCD`
FROM ((`MstRole` `a`
  JOIN `RtnRoleMenu` `b`)
  JOIN `MstMenu` `c`)
WHERE ((`a`.`RoleID` = `b`.`RoleID`) AND (`b`.`MenuID` = `c`.`MenuID`))
ORDER BY `a`.`ShowIndex`, `c`.`DisplayIndex`;USE ivggs_whs;
DROP VIEW ivggs_whs.VW_WFObjEm CASCADE;
CREATE
VIEW ivggs_whs.VW_WFObjEm
AS
SELECT
  `a`.`EmployeeID` AS `EmployeeID`,
  `a`.`SEmployeeID` AS `SEmployeeID`,
  `a`.`SEmployeeCode` AS `SEmployeeCode`,
  `a`.`SEmployeeNo` AS `SEmployeeNo`,
  `a`.`SNameCN` AS `SNameCN`,
  `a`.`SNameEN` AS `SNameEN`,
  `a`.`SNameJP` AS `SNameJP`,
  `a`.`SOrgID` AS `SOrgID`,
  `a`.`SOrgCD` AS `SOrgCD`,
  `a`.`SOrgLevel` AS `SOrgLevel`,
  `a`.`SOrgNameCN` AS `SOrgNameCN`,
  `a`.`SOrgNameEN` AS `SOrgNameEN`,
  `a`.`SOrgNameJP` AS `SOrgNameJP`,
  `a`.`PosUsefulFromDt` AS `PosUsefulFromDt`,
  `a`.`PosUsefulToDt` AS `PosUsefulToDt`
FROM (`TMP_EmSub` `a`
  JOIN `MstPosition` `b`)
WHERE ((`a`.`PositionID` = `b`.`PositionID`) AND (`b`.`FlgCanApprove` = '1'));USE ivggs_whs;
DROP VIEW ivggs_whs.VW_CommitWFInfo CASCADE;
CREATE
VIEW ivggs_whs.VW_CommitWFInfo
AS
SELECT
  `a`.`WFVersionID` AS `WFVersionID`,
  `b`.`WFExtID` AS `WFExtID`,
  `b`.`TableName` AS `TableName`,
  `b`.`KeyName` AS `KeyName`,
  `a`.`DtFrom` AS `DtFrom`,
  `a`.`DtTo` AS `DtTo`,
  `c`.`WFStepID` AS `WFStepID`,
  `c`.`RejectStepID` AS `RejectStepID`,
  `c`.`PrevStepID` AS `PrevStepID`,
  `c`.`NextStepID` AS `NextStepID`,
  `c`.`FlgApprove` AS `FlgApprove`,
  `c`.`FlgReject` AS `FlgReject`,
  `c`.`FlgCreateStep` AS `FlgCreateStep`,
  `c`.`FlgApproveStep` AS `FlgApproveStep`,
  `c`.`FlgEndStep` AS `FlgEndStep`,
  `d`.`PositionID` AS `PositionID`,
  `d`.`OrgCD` AS `OrgCD`,
  `b`.`DWFType` AS `DWFType`
FROM (((`MstWFVersion` `a`
  JOIN `MstWFExt` `b`)
  JOIN `MstWFStep` `c`)
  JOIN `RtnWFPosition` `d`)
WHERE ((`a`.`WFVersionID` = `b`.`WFVersionID`) AND (`b`.`WFExtID` = `c`.`WFExtID`) AND (`b`.`WFExtID` = `d`.`WFExtID`) AND (`c`.`WFStepID` = `d`.`WFStepID`) AND (`a`.`DelFlg` = '0') AND (`c`.`FlgCreateStep` = 1));USE ivggs_whs;
DROP VIEW ivggs_whs.VW_ConfirmWFInfo CASCADE;
CREATE
VIEW ivggs_whs.VW_ConfirmWFInfo
AS
SELECT
  `a`.`WFVersionID` AS `WFVersionID`,
  `b`.`WFExtID` AS `WFExtID`,
  `b`.`TableName` AS `TableName`,
  `b`.`KeyName` AS `KeyName`,
  `a`.`DtFrom` AS `DtFrom`,
  `a`.`DtTo` AS `DtTo`,
  `c`.`WFStepID` AS `WFStepID`,
  `c`.`RejectStepID` AS `RejectStepID`,
  `c`.`PrevStepID` AS `PrevStepID`,
  `c`.`NextStepID` AS `NextStepID`,
  `c`.`FlgApprove` AS `FlgApprove`,
  `c`.`FlgReject` AS `FlgReject`,
  `c`.`FlgCreateStep` AS `FlgCreateStep`,
  `c`.`FlgApproveStep` AS `FlgApproveStep`,
  `c`.`FlgEndStep` AS `FlgEndStep`,
  `d`.`PositionID` AS `PositionID`,
  `d`.`OrgCD` AS `OrgCD`,
  `b`.`DWFType` AS `DWFType`
FROM (((`MstWFVersion` `a`
  JOIN `MstWFExt` `b`)
  JOIN `MstWFStep` `c`)
  JOIN `RtnWFPosition` `d`)
WHERE ((`a`.`WFVersionID` = `b`.`WFVersionID`) AND (`b`.`WFExtID` = `c`.`WFExtID`) AND (`b`.`WFExtID` = `d`.`WFExtID`) AND (`c`.`WFStepID` = `d`.`WFStepID`) AND (`a`.`DelFlg` = '0') AND (`c`.`FlgApproveStep` = 1));USE ivggs_whs;
DROP VIEW ivggs_whs.VW_EmployeeInfo CASCADE;
CREATE
VIEW ivggs_whs.VW_EmployeeInfo
AS
SELECT
  `a`.`EmployeeID` AS `EmployeeID`,
  `a`.`EmployeeNo` AS `EmployeeNo`,
  `a`.`LoginName` AS `LoginName`,
  `a`.`NameCN` AS `EmployeeName`,
  `c`.`RoleID` AS `RoleID`,
  `c`.`NameCN` AS `RoleName`,
  `e`.`MenuID` AS `MenuID`,
  `e`.`MenuCD` AS `MenuCD`,
  `e`.`NameCN` AS `MenuName`,
  `e`.`URL` AS `MenuURL`,
  `g`.`FunctionCD` AS `FunctionCD`,
  `g`.`Name` AS `FunctionName`,
  `g`.`URL` AS `FunctionURL`,
  `f`.`AccessLevel` AS `AccessLevel`,
  `f`.`AccessMethod` AS `AccessMethod`
FROM ((((((`TrnEmployee` `a`
  LEFT JOIN `RtnUserRole` `b`
    ON ((`a`.`EmployeeID` = `b`.`EmployeeID`)))
  LEFT JOIN `MstRole` `c`
    ON ((`b`.`RoleID` = `c`.`RoleID`)))
  LEFT JOIN `RtnRoleMenu` `d`
    ON ((`b`.`RoleID` = `d`.`RoleID`)))
  LEFT JOIN `MstMenu` `e`
    ON ((`d`.`MenuID` = `e`.`MenuID`)))
  LEFT JOIN `RtnRoleFunction` `f`
    ON ((`b`.`RoleID` = `f`.`RoleID`)))
  LEFT JOIN `MstFunction` `g`
    ON ((`f`.`FunctionCD` = `g`.`FunctionCD`)))
ORDER BY `a`.`EmployeeID`, `b`.`RoleID`, `e`.`MenuID`, `g`.`FunctionCD`;USE ivggs_whs;
DROP VIEW ivggs_whs.VW_ProxyInfo CASCADE;
CREATE
VIEW ivggs_whs.VW_ProxyInfo
AS
SELECT
  `a`.`ProxyInfoID` AS `ProxyInfoID`,
  `a`.`ClientID` AS `ClientID`,
  `a`.`FlgShare` AS `FlgShare`,
  `a`.`FromDt` AS `FromDt`,
  `a`.`ToDt` AS `ToDt`,
  `b`.`WFStepID` AS `WFStepID`,
  `c`.`AgentID` AS `AgentID`,
  `d`.`EmployeeID` AS `EmployeeID`
FROM (((`MstProxyInfo` `a`
  JOIN `MstProxyContent` `b`)
  JOIN `MstProxyer` `c`)
  JOIN `MstProxyAim` `d`)
WHERE ((`a`.`ProxyInfoID` = `b`.`ProxyInfoID`) AND (`a`.`ProxyInfoID` = `c`.`ProxyInfoID`) AND (`a`.`ProxyInfoID` = `d`.`ProxyInfoID`) AND (`a`.`DelFlg` = '0') AND (`a`.`FlgEnable` = 1));USE ivggs_whs;
DROP VIEW ivggs_whs.VW_RoleFunction CASCADE;
CREATE
VIEW ivggs_whs.VW_RoleFunction
AS
SELECT
  `c`.`RoleID` AS `RoleID`,
  `c`.`NameCN` AS `RoleNameCN`,
  `a`.`FunctionCD` AS `FunctionCD`,
  `a`.`Name` AS `FunctionName`,
  `b`.`AccessLevel` AS `AccessLevel`,
  `b`.`AccessMethod` AS `AccessMethod`
FROM ((`MstFunction` `a`
  JOIN `RtnRoleFunction` `b`)
  JOIN `MstRole` `c`)
WHERE ((`a`.`FunctionCD` = `b`.`FunctionCD`) AND (`b`.`RoleID` = `c`.`RoleID`));USE ivggs_whs;
DROP VIEW ivggs_whs.VW_RoleMenu CASCADE;
CREATE
VIEW ivggs_whs.VW_RoleMenu
AS
SELECT
  `a`.`RoleID` AS `RoleID`,
  `c`.`MenuID` AS `MenuID`,
  `a`.`NameCN` AS `RoleNameCN`,
  `c`.`NameCN` AS `MenuNameCN`,
  `c`.`Level` AS `MenuLevel`,
  `c`.`MenuCD` AS `MenuCD`
FROM ((`MstRole` `a`
  JOIN `RtnRoleMenu` `b`)
  JOIN `MstMenu` `c`)
WHERE ((`a`.`RoleID` = `b`.`RoleID`) AND (`b`.`MenuID` = `c`.`MenuID`))
ORDER BY `a`.`ShowIndex`, `c`.`DisplayIndex`;USE ivggs_whs;
DROP VIEW ivggs_whs.VW_WFObjEm CASCADE;
CREATE
VIEW ivggs_whs.VW_WFObjEm
AS
SELECT
  `a`.`EmployeeID` AS `EmployeeID`,
  `a`.`SEmployeeID` AS `SEmployeeID`,
  `a`.`SEmployeeCode` AS `SEmployeeCode`,
  `a`.`SEmployeeNo` AS `SEmployeeNo`,
  `a`.`SNameCN` AS `SNameCN`,
  `a`.`SNameEN` AS `SNameEN`,
  `a`.`SNameJP` AS `SNameJP`,
  `a`.`SOrgID` AS `SOrgID`,
  `a`.`SOrgCD` AS `SOrgCD`,
  `a`.`SOrgLevel` AS `SOrgLevel`,
  `a`.`SOrgNameCN` AS `SOrgNameCN`,
  `a`.`SOrgNameEN` AS `SOrgNameEN`,
  `a`.`SOrgNameJP` AS `SOrgNameJP`,
  `a`.`PosUsefulFromDt` AS `PosUsefulFromDt`,
  `a`.`PosUsefulToDt` AS `PosUsefulToDt`
FROM (`TMP_EmSub` `a`
  JOIN `MstPosition` `b`)
WHERE ((`a`.`PositionID` = `b`.`PositionID`) AND (`b`.`FlgCanApprove` = '1'));USE ivggs_whs;

DELIMITER $$
DROP FUNCTION IF EXISTS ivggs_whs.fnAES_DECRYPT$$
CREATE
FUNCTION ivggs_whs.fnAES_DECRYPT (inValue varchar(64), inKey varchar(255))
RETURNS varchar(255) charset utf8
READS SQL DATA
BEGIN
  DECLARE p_Out varchar(255);
  DECLARE p_inValue blob;
  DECLARE p_key varchar(255);

  SET p_inValue = inValue;

  IF inKey IS NULL THEN
    SELECT
      Des INTO p_key
    FROM ivggs_whs.MstDictData
    WHERE DictType = 'SecretPassphrase';
  ELSEIF inKey = '' THEN
    SELECT
      Des INTO p_key
    FROM ivggs_whs.MstDictData
    WHERE DictType = 'SecretPassphrase';
  ELSE
    SET p_key = inKey;
  END IF;


  IF
    p_inValue IS NOT NULL THEN
    SELECT
      AES_DECRYPT(UNHEX(p_inValue), p_key) result INTO p_Out
    FROM dual;
  END IF;

  IF p_Out IS NULL THEN
    RETURN '';
  END IF;

  RETURN p_Out;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP FUNCTION IF EXISTS ivggs_whs.fnAES_ENCRYPT$$
CREATE
FUNCTION ivggs_whs.fnAES_ENCRYPT (inValue varchar(255), inKey varchar(255))
RETURNS varchar(64) charset utf8
READS SQL DATA
BEGIN
  DECLARE p_Out blob;
  DECLARE p_inValue varchar(255);
  DECLARE p_key varchar(255);

  SET p_inValue = inValue;

  IF inKey IS NULL THEN
    SELECT
      Des INTO p_key
    FROM ivggs_whs.MstDictData
    WHERE DictType = 'SecretPassphrase';
  ELSEIF inKey = '' THEN
    SELECT
      Des INTO p_key
    FROM ivggs_whs.MstDictData
    WHERE DictType = 'SecretPassphrase';
  ELSE
    SET p_key = inKey;
  END IF;

  IF p_inValue IS NULL THEN
    SET p_Out = '';
  ELSEIF
    p_inValue = '' THEN
    SET p_Out = '';
  ELSE
    SELECT
      AES_ENCRYPT(p_inValue, p_key) result INTO p_Out
    FROM dual;
  END IF;

  IF p_Out IS NULL THEN
    RETURN '';
  END IF;
  RETURN HEX(p_Out);
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP FUNCTION IF EXISTS ivggs_whs.fnGetDictName$$
CREATE
FUNCTION ivggs_whs.fnGetDictName (inKey varchar(255), inCode smallint, inLocal char(2))
RETURNS varchar(255) charset utf8
READS SQL DATA
BEGIN
  DECLARE vOut varchar(255);
  DECLARE vLocal char(2);

  SET vLocal = UPPER(inLocal);
  IF vLocal = 'CN' THEN
    SELECT
      m.DisplayCN INTO vOut
    FROM MstDictData m
    WHERE m.DictType = inKey AND m.value = inCode LIMIT 1;
  ELSEIF vLocal = 'JP' THEN
    SELECT
      m.DisplayJP INTO vOut
    FROM MstDictData m
    WHERE m.DictType = inKey AND m.value = inCode LIMIT 1;
  ELSE
    SELECT
      m.DisplayEN INTO vOut
    FROM MstDictData m
    WHERE m.DictType = inKey AND m.value = inCode LIMIT 1;
  END IF;
  IF vOut IS NULL THEN
    SET vOut = '';
  END IF;
  RETURN vOut;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP FUNCTION IF EXISTS ivggs_whs.fnGetRelatedOVFormID$$
CREATE
FUNCTION ivggs_whs.fnGetRelatedOVFormID (inWHFormID int)
RETURNS int(11)
READS SQL DATA
BEGIN
  DECLARE rtIN int;
  DECLARE varObjYMD char(8);
  DECLARE varEmployeeID int;
  SELECT
    t.ObjYMD,
    t.EmployeeID INTO varObjYMD, varEmployeeID
  FROM TrnWHForm t
  WHERE t.WHFormID = inWHFormID AND t.DelFlg = '1';
  IF varObjYMD IS NULL THEN
    RETURN 0;
  END IF;

  SELECT
    t.OVFormID INTO rtIN
  FROM TrnOVForm t
  WHERE t.EmployeeID = varEmployeeID AND t.ObjYMD = varObjYMD AND t.DelFlg = '1';

  IF rtIN IS NULL THEN
    RETURN 0;
  END IF;
  RETURN rtIN;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP FUNCTION IF EXISTS ivggs_whs.fnGetRelatedVCFormID$$
CREATE
FUNCTION ivggs_whs.fnGetRelatedVCFormID (inWHFormID int)
RETURNS int(11)
READS SQL DATA
BEGIN
  DECLARE rtIN int;
  DECLARE varObjYMD char(8);
  DECLARE varEmployeeID int;
  SELECT
    t.ObjYMD,
    t.EmployeeID INTO varObjYMD, varEmployeeID
  FROM TrnWHForm t
  WHERE t.WHFormID = inWHFormID AND t.DelFlg = '1';
  IF varObjYMD IS NULL THEN
    RETURN 0;
  END IF;

  SELECT
    a.VCFormID INTO rtIN
  FROM TrnVCForm a,
       TrnVCFormDetail b
  WHERE a.VCFormID = b.VCFormID AND a.EmployeeID = varEmployeeID AND b.ObjYMD = varObjYMD;

  IF rtIN IS NULL THEN
    RETURN 0;
  END IF;
  RETURN rtIN;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP FUNCTION IF EXISTS ivggs_whs.fnGetRelatedWHFormIDByVC$$
CREATE
FUNCTION ivggs_whs.fnGetRelatedWHFormIDByVC (inVCFormID int)
RETURNS int(11)
READS SQL DATA
BEGIN
  DECLARE rtIN int;
  DECLARE varObjYMD char(8);
  DECLARE varEmployeeID int;
  SELECT
    t.ObjYMD,
    t.EmployeeID INTO varObjYMD, varEmployeeID
  FROM TrnVCForm t
  WHERE t.VCFormID = inVCFormID AND t.DelFlg = '1';
  IF varObjYMD IS NULL THEN
    RETURN 0;
  END IF;

  SELECT
    t.OVFormID INTO rtIN
  FROM TrnWHForm t
  WHERE t.EmployeeID = varEmployeeID AND t.ObjYMD = varObjYMD AND t.DelFlg = '1';

  IF rtIN IS NULL THEN
    RETURN 0;
  END IF;
  RETURN rtIN;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP FUNCTION IF EXISTS ivggs_whs.fnGetStrArrayAtIndex$$
CREATE
FUNCTION ivggs_whs.fnGetStrArrayAtIndex (inStrTar varchar(2048), inSplit varchar(10), inIndex int, inReturnSplit boolean)
RETURNS varchar(1024) charset utf8
NO SQL
BEGIN
  DECLARE vLocation int;
  DECLARE vStart int;
  DECLARE vNext int;
  DECLARE vSeed int;

  IF inStrTar IS NULL THEN
    SET inStrTar = '';
  END IF;


  SET inStrTar = LTRIM(RTRIM(inStrTar));
  SET vSeed = LENGTH(inSplit);
  SET vLocation = LOCATE(inSplit, inStrTar);
  IF vLocation = 0 THEN
    IF inReturnSplit THEN
      RETURN CONCAT(inStrTar, inSplit);
    ELSE
      RETURN inStrTar;
    END IF;
  ELSE
    SET inStrTar = CONCAT(inStrTar, inSplit);
  END IF;
  SET vStart = 1;
  SET vNext = 1;

  WHILE vLocation <> 0 AND inIndex > vNext DO
    SET vStart = vLocation + vSeed;
    SET vLocation = LOCATE(inSplit, inStrTar, vStart);
    SET vNext = vNext + 1;
  END WHILE;

  IF inReturnSplit THEN
    RETURN CONCAT(SUBSTRING(inStrTar, vStart, vLocation - vStart), inSplit);
  ELSE
    RETURN SUBSTRING(inStrTar, vStart, vLocation - vStart);
  END IF;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP FUNCTION IF EXISTS ivggs_whs.fnGetStrArrayLength$$
CREATE
FUNCTION ivggs_whs.fnGetStrArrayLength (inStr varchar(2048), inSplit varchar(10))
RETURNS int(11)
NO SQL
BEGIN
  DECLARE vLocation int;
  DECLARE vStart int;
  DECLARE vLength int;
  SET inStr = LTRIM(RTRIM(inStr));
  SET vLocation = LOCATE(inSplit, inStr);
  SET vLength = 1;
  WHILE vLocation <> 0 DO
    SET vStart = vLocation + 1;
    SET vLocation = LOCATE(inSplit, inStr, vStart);
    SET vLength = vLength + 1;
  END WHILE;
  RETURN vLength;

END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP FUNCTION IF EXISTS ivggs_whs.fnIsOVFinish$$
CREATE
FUNCTION ivggs_whs.fnIsOVFinish (inObjYMD char(8), inWHFormID int)
RETURNS int(11)
READS SQL DATA
BEGIN
  /**
  *判断对象日时的加班申请是否已经通过审批
  *返回值：
  *1: 已经通过审批，或者当天无加班数据；
  *0：未通过审批
  *-1：考勤数据错误
  *-2: 记录数不符（该员工在对象日的加班记录多余一条）；
  *-100:SQL 错误
  **/
  DECLARE vRecCnt int;
  DECLARE vStatus smallint;
  DECLARE vOVFormID int;
  DECLARE vEmployeeID int;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION RETURN - 100;

  /**取得考勤数据的员工ID**/
  SELECT
    t.EmployeeID INTO vEmployeeID
  FROM TrnWHForm t
  WHERE t.ObjYMD = inObjYMD AND t.WHFormID = inWHFormID AND t.DelFlg = '0';
  IF vEmployeeID IS NULL THEN
    RETURN - 1;
  END IF;

  /**取得该员工的加班数据**/
  SELECT
    COUNT(t.OVFormID),
    MAX(t.DtAppStatus) INTO vRecCnt, vStatus
  FROM TrnOVForm t
  WHERE t.ObjYMD = inObjYMD AND t.EmployeeID = vEmployeeID AND t.DelFlg = '0';


  IF vRecCnt > 1 THEN
    RETURN - 1;
  END IF;
  IF vRecCnt = 0 THEN
    RETURN 1;
  END IF;
  IF vStatus = 2 THEN
    RETURN 1;
  END IF;

  RETURN 0;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP FUNCTION IF EXISTS ivggs_whs.fnIsVCFinish$$
CREATE
FUNCTION ivggs_whs.fnIsVCFinish (inObjYMD char(8), inWHFormID int)
RETURNS int(11)
READS SQL DATA
BEGIN
  /**
  *判断对象日时的休假申请是否已经通过审批
  *返回值：
  *1: 已经通过审批，或者当天无加班数据；
  *0：未通过审批
  *-1：考勤数据错误
  *-100:SQL 错误
  **/
  DECLARE vRecCnt int;
  DECLARE vEmployeeID int;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION RETURN - 100;

  /**取得考勤数据的员工ID**/
  SELECT
    t.EmployeeID INTO vEmployeeID
  FROM TrnWHForm t
  WHERE t.ObjYMD = inObjYMD AND t.WHFormID = inWHFormID AND t.DelFlg = '0';
  IF vEmployeeID IS NULL THEN
    RETURN - 1;
  END IF;

  /**取得该员工未通过审批的休假数据**/
  SELECT
    COUNT(a.VCFormID) INTO vRecCnt
  FROM TrnVCForm a,
       TrnVCFormDetail b
  WHERE a.DelFlg = '0' AND a.EmployeeID = vEmployeeID AND a.VCFormID = b.VCFormID AND b.ObjYMD = inObjYMD AND a.DtAppStatus != 2;

  IF vRecCnt = 0 THEN
    RETURN 1;
  END IF;

  RETURN 0;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP FUNCTION IF EXISTS ivggs_whs.fnLocalGet$$
CREATE
FUNCTION ivggs_whs.fnLocalGet (inCN varchar(512), inEN varchar(512), inJP varchar(512), inLocal char(2))
RETURNS varchar(512) 
NO SQL
BEGIN
  DECLARE vLocal char(2);

  SET vLocal = UPPER(inLocal);
  IF vLocal = 'CN' THEN
    RETURN inCN;
  ELSEIF vLocal = 'JP' THEN
    RETURN inJP;
  ELSE
    RETURN inEN;
  END IF;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP FUNCTION IF EXISTS ivggs_whs.fnReplaceStrArray$$
CREATE
FUNCTION ivggs_whs.fnReplaceStrArray (inStrSrc varchar(2048), inStrTar varchar(2048), inSplit varchar(10), inReplaceWith varchar(128))
RETURNS varchar(2048) charset utf8
NO SQL
BEGIN
  DECLARE vTempIndex int;
  DECLARE vTempTarStr varchar(1024);
  IF LENGTH(inStrSrc) > 0 THEN
    SET inStrSrc = CONCAT(inSplit, inStrSrc, inSplit);
    /** SET inStrTar = CONCAT(inSplit, inStrTar, inSplit);**/
    SET vTempIndex = fnGetStrArrayLength(inStrTar, inSplit);
    IF inReplaceWith IS NULL THEN
      SET inReplaceWith = inSplit;
    ELSEIF LENGTH(inReplaceWith) = 0 THEN
      SET inReplaceWith = inSplit;
    ELSE
      SET inReplaceWith = CONCAT(inSplit, inReplaceWith, inSplit);
    END IF;
    WHILE vTempIndex > 0 DO
      SET vTempTarStr = fnGetStrArrayAtIndex(inStrTar, inSplit, vTempIndex, FALSE);
      IF LENGTH(vTempTarStr) > 0 THEN
        SET vTempTarStr = CONCAT(inSplit, vTempTarStr, inSplit);
        SET inStrSrc = REPLACE(inStrSrc, vTempTarStr, inReplaceWith);
      END IF;
      SET vTempIndex = vTempIndex - 1;
    END WHILE;
    SET inStrSrc = SUBSTR(inStrSrc, LENGTH(inSplit) + 1, LENGTH(inStrSrc) - LENGTH(inSplit) * 2);
  END IF;
  RETURN inStrSrc;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP PROCEDURE IF EXISTS ivggs_whs.procPrepareTmpFile$$
CREATE
PROCEDURE ivggs_whs.procPrepareTmpFile (IN inTableName varchar(64), IN inTableKey int, OUT outFileToken varchar(64), OUT outFileCount int)
LBL_EXIT:
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION SET outFileCount = - 1, outFileToken = UUID();

  SELECT
    UUID() INTO outFileToken
  FROM dual;

  SELECT
    COUNT(t.FileID) INTO outFileCount
  FROM TrnFile t
  WHERE t.TableName = inTableName AND t.TableKey = inTableKey AND t.DelFlg = '0';

  IF outFileCount = 0 THEN
    LEAVE LBL_EXIT;
  END IF;

  INSERT INTO TmpFile (FileToken, AttachmentName, File, FullPath, FlgMain, FlgEncrypt, ShowIndex)
    SELECT
      outFileToken,
      t.AttachmentName,
      t.File,
      t.FullPath,
      t.FlgMain,
      t.FlgEncrypt,
      t.ShowIndex
    FROM TrnFile t
    WHERE t.TableName = inTableName AND t.TableKey = inTableKey AND t.DelFlg = '0'
    ORDER BY t.ShowIndex;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP PROCEDURE IF EXISTS procRefreshEmOrg$$
CREATE
PROCEDURE procRefreshEmOrg ()
BEGIN
  DECLARE varEmOrgTableCount int;

  SELECT
    COUNT(*) INTO varEmOrgTableCount
  FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = 'ivggs_whs' AND TABLE_NAME = 'TMP_EmOrg';
  IF varEmOrgTableCount > 0 THEN
    DROP TABLE TMP_EmOrg;
  END IF;

  CREATE TABLE TMP_EmOrg (
    EmployeeID int,
    EmployeeCode varchar(64),
    EmployeeNo varchar(64),
    OrgID int,
    OrgCD varchar(64),
    OrgNameCN varchar(256),
    OrgNameEN varchar(256),
    OrgNameJP varchar(256),
    OrgLevel int,
    OrgUsefulFromDt char(8),
    OrgUsefulToDt char(8),
    FlgPart smallint,
    PosUsefulFromDt char(8),
    PosUsefulToDt char(8),
    PositionID int,
    Level int,
    PosNameCN varchar(128),
    PosNameEN varchar(128),
    PosNameJP varchar(128),
    FlgCanApprove smallint,
    CurrentOrgCD varchar(64),
    CurrentOrgID int
  ) ENGINE = INNODB;

  INSERT INTO TMP_EmOrg (EmployeeID, EmployeeCode, EmployeeNo
  , OrgID, OrgCD, OrgNameCN, OrgNameEN, OrgNameJP
  , OrgLevel, OrgUsefulFromDt, OrgUsefulToDt
  , FlgPart, PosUsefulFromDt, PosUsefulToDt
  , PositionID, Level, PosNameCN, PosNameEN, PosNameJP
  , FlgCanApprove
  , CurrentOrgCD, CurrentOrgID)
    SELECT
      *
    FROM (SELECT
        a.EmployeeID,
        a.EmployeeCode,
        a.EmployeeNo,
        d.FOrgID AS OrgID,
        d.FOrgCD AS OrgCD,
        d.FOrgNameCN AS OrgNameCN,
        d.FOrgNameEN AS OrgNameEN,
        d.FOrgNameJP AS OrgNameJP,
        d.FOrgLevel AS OrgLevel,
        d.UsefulFromDt AS OrgUsefulFromDt,
        d.UsefulToDt AS OrgUsefulToDt,
        b.FlgPart,
        b.UsefulFromDt AS PosUsefulFromDt,
        b.UsefulToDt AS PosUsefulToDt,
        c.PositionID,
        c.Level,
        c.NameCN AS PosNameCN,
        c.NameEN AS PosNameEN,
        c.NameJP AS PosNameJP,
        c.FlgCanApprove,
        b.OrgCD AS CurrentOrgCD,
        d.OrgID AS CurrentOrgID
      FROM TrnEmployee a,
           RtnEmployeeOrg b,
           MstPosition c,
           TMP_Org d
      WHERE a.EmployeeID = b.EmployeeID AND b.OrgCD = d.OrgCD AND b.PositionID = c.PositionID
      AND a.DelFlg = '0' AND b.DelFlg = '0' AND c.DelFlg = '0'
      AND b.UsefulFromDt >= d.UsefulFromDt AND b.UsefulToDt <= d.UsefulToDt
      UNION ALL
      SELECT
        a.EmployeeID,
        a.EmployeeCode,
        a.EmployeeNo,
        d.OrgID,
        b.OrgCD,
        d.NameCN AS OrgNameCN,
        d.NameEN AS OrgNameEN,
        d.NameJP AS OrgNameJP,
        d.OrgLevel AS OrgLevel,
        d.UsefulFromDt AS OrgUsefulFromDt,
        d.UsefulToDt AS OrgUsefulToDt,
        b.FlgPart,
        b.UsefulFromDt AS PosUsefulFromDt,
        b.UsefulToDt AS PosUsefulToDt,
        c.PositionID,
        c.Level,
        c.NameCN AS PosNameCN,
        c.NameEN AS PosNameEN,
        c.NameJP AS PosNameJP,
        c.FlgCanApprove,
        b.OrgCD AS CurrentOrgCD,
        d.OrgID AS CurrentOrgID
      FROM TrnEmployee a,
           RtnEmployeeOrg b,
           MstPosition c,
           MstOrg d
      WHERE a.EmployeeID = b.EmployeeID AND b.OrgCD = d.OrgCD AND b.PositionID = c.PositionID
      AND a.DelFlg = '0' AND b.DelFlg = '0' AND c.DelFlg = '0'
      AND b.UsefulFromDt >= d.UsefulFromDt AND b.UsefulToDt <= d.UsefulToDt) AS tb;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP PROCEDURE IF EXISTS procRefreshEmOrgOne$$
CREATE
PROCEDURE procRefreshEmOrgOne (IN inEmployeeID int)
BEGIN
  DELETE
    FROM TMP_EmOrg
  WHERE EmployeeID = inEmployeeID;

  INSERT INTO TMP_EmOrg (EmployeeID, EmployeeCode, EmployeeNo
  , OrgID, OrgCD, OrgNameCN, OrgNameEN, OrgNameJP
  , OrgLevel, OrgUsefulFromDt, OrgUsefulToDt
  , FlgPart, PosUsefulFromDt, PosUsefulToDt
  , PositionID, Level, PosNameCN, PosNameEN, PosNameJP
  , FlgCanApprove
  , CurrentOrgCD, CurrentOrgID)
    SELECT
      *
    FROM (SELECT
        a.EmployeeID,
        a.EmployeeCode,
        a.EmployeeNo,
        d.FOrgID AS OrgID,
        d.FOrgCD AS OrgCD,
        d.FOrgNameCN AS OrgNameCN,
        d.FOrgNameEN AS OrgNameEN,
        d.FOrgNameJP AS OrgNameJP,
        d.FOrgLevel AS OrgLevel,
        d.UsefulFromDt AS OrgUsefulFromDt,
        d.UsefulToDt AS OrgUsefulToDt,
        b.FlgPart,
        b.UsefulFromDt AS PosUsefulFromDt,
        b.UsefulToDt AS PosUsefulToDt,
        c.PositionID,
        c.Level,
        c.NameCN AS PosNameCN,
        c.NameEN AS PosNameEN,
        c.NameJP AS PosNameJP,
        c.FlgCanApprove,
        b.OrgCD AS CurrentOrgCD,
        d.OrgID AS CurrentOrgID
      FROM TrnEmployee a,
           RtnEmployeeOrg b,
           MstPosition c,
           TMP_Org d
      WHERE a.EmployeeID = inEmployeeID AND a.EmployeeID = b.EmployeeID AND b.OrgCD = d.OrgCD AND b.PositionID = c.PositionID
      AND a.DelFlg = '0' AND b.DelFlg = '0' AND c.DelFlg = '0'
      AND b.UsefulFromDt >= d.UsefulFromDt AND b.UsefulToDt <= d.UsefulToDt
      UNION ALL
      SELECT
        a.EmployeeID,
        a.EmployeeCode,
        a.EmployeeNo,
        d.OrgID,
        b.OrgCD,
        d.NameCN AS OrgNameCN,
        d.NameEN AS OrgNameEN,
        d.NameJP AS OrgNameJP,
        d.OrgLevel AS OrgLevel,
        d.UsefulFromDt AS OrgUsefulFromDt,
        d.UsefulToDt AS OrgUsefulToDt,
        b.FlgPart,
        b.UsefulFromDt AS PosUsefulFromDt,
        b.UsefulToDt AS PosUsefulToDt,
        c.PositionID,
        c.Level,
        c.NameCN AS PosNameCN,
        c.NameEN AS PosNameEN,
        c.NameJP AS PosNameJP,
        c.FlgCanApprove,
        b.OrgCD AS CurrentOrgCD,
        d.OrgID AS CurrentOrgID
      FROM TrnEmployee a,
           RtnEmployeeOrg b,
           MstPosition c,
           MstOrg d
      WHERE a.EmployeeID = inEmployeeID AND a.EmployeeID = b.EmployeeID AND b.OrgCD = d.OrgCD AND b.PositionID = c.PositionID
      AND a.DelFlg = '0' AND b.DelFlg = '0' AND c.DelFlg = '0'
      AND b.UsefulFromDt >= d.UsefulFromDt AND b.UsefulToDt <= d.UsefulToDt) AS tb;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP PROCEDURE IF EXISTS ivggs_whs.procRefreshEmSub$$
CREATE
PROCEDURE ivggs_whs.procRefreshEmSub ()
BEGIN
  DECLARE varEmSubTableCount int;

  SELECT
    COUNT(*) INTO varEmSubTableCount
  FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = 'ivggs_whs' AND TABLE_NAME = 'TMP_EmSub';
  IF varEmSubTableCount > 0 THEN
    DROP TABLE TMP_EmSub;
  END IF;

  CREATE TABLE TMP_EmSub (
    EmployeeID int, /**员工ID**/
    EmployeeCode varchar(64), /**员工代码**/
    EmployeeNo varchar(64), /**员工编号**/
    PositionID int, /**职务ID**/
    PosLevel int, /**职务级别ID**/
    FlgPart smallint, /**兼职标志**/
    PosUsefulFromDt char(8), /**职务有效期**/
    PosUsefulToDt char(8),
    OrgID int, /**员工组织ID**/
    OrgCD varchar(64),
    OrgLevel int,
    SEmployeeID int, /**下属员工ID**/
    SEmployeeCode varchar(64), /**下属员工代码**/
    SEmployeeNo varchar(64), /**下属员工编号**/
    SNameCN varchar(256), /**下属员工姓名**/
    SNameEN varchar(256),
    SNameJP varchar(256),
    SOrgID int, /**下属员工组织ID**/
    SOrgCD varchar(64),
    SOrgLevel int,
    SOrgNameCN varchar(256),
    SOrgNameEN varchar(256),
    SOrgNameJP varchar(256),
    SPositionID int, /**下属员工职务ID**/
    SPosLevel int,
    SFlgPart smallint/**下属兼职标志**/
  ) ENGINE = INNODB;


  INSERT INTO TMP_EmSub (EmployeeID, EmployeeCode, EmployeeNo, PositionID, PosLevel, FlgPart, PosUsefulFromDt, PosUsefulToDt, OrgID, OrgCD, OrgLevel, SEmployeeID, SEmployeeCode, SEmployeeNo, SNameCN, SNameEN, SNameJP, SOrgID, SOrgCD, SOrgLevel, SOrgNameCN, SOrgNameEN, SOrgNameJP, SPositionID, SPosLevel, SFlgPart)
    SELECT DISTINCT
      *
    FROM (SELECT
        a.EmployeeID,
        a.EmployeeCode,
        a.EmployeeNo,
        b.PositionID,
        g.Level AS PosLevel,
        b.FlgPart,
        b.UsefulFromDt AS PosUsefulFromDt,
        b.UsefulToDt AS PosUsefulToDt,
        c.OrgID,
        c.OrgCD,
        c.OrgLevel,
        e.EmployeeID AS SEmployeeID,
        e.EmployeeCode AS SEmployeeCode,
        e.EmployeeNo AS SEmployeeNo,
        f.NameCN AS SNameCN,
        f.NameEN AS SNameEN,
        f.NameJP AS SNameJP,
        d.OrgID AS SOrgID,
        d.OrgCD AS SOrgCD,
        d.OrgLevel AS SOrgLevel,
        d.OrgNameCN AS SOrgNameCN,
        d.OrgNameEN AS SOrgNameEN,
        d.OrgNameJP AS SOrgNameJP,
        e.PositionID AS SPositionID,
        e.Level AS SPosLevel,
        h.FlgPart AS SFlgPart
      FROM TrnEmployee a,
           RtnEmployeeOrg b,
           MstOrg c,
           TMP_Org d,
           TMP_EmOrg e,
           TrnEmployee f,
           MstPosition g,
           RtnEmployeeOrg h
      WHERE a.EmployeeID = b.EmployeeID AND b.OrgCD = c.OrgCD AND b.UsefulFromDt >= c.UsefulFromDt AND b.UsefulToDt <= c.UsefulToDt
      AND d.FOrgID = c.OrgID AND d.OrgID = e.OrgID AND e.EmployeeID = f.EmployeeID AND b.PositionID = g.PositionID AND g.Level > e.Level
      AND e.CurrentOrgID = e.OrgID AND f.EmployeeID = h.EmployeeID AND d.OrgCD = h.OrgCD
      AND a.DelFlg = '0' AND b.DelFlg = '0' AND c.DelFlg = '0' AND h.DelFlg = '0') tb;

  INSERT INTO TMP_EmSub (EmployeeID, EmployeeCode, EmployeeNo, PositionID, PosLevel, FlgPart, PosUsefulFromDt, PosUsefulToDt, OrgID, OrgCD, OrgLevel, SEmployeeID, SEmployeeCode, SEmployeeNo, SNameCN, SNameEN, SNameJP, SOrgID, SOrgCD, SOrgLevel, SOrgNameCN, SOrgNameEN, SOrgNameJP, SPositionID, SPosLevel, SFlgPart)
    SELECT DISTINCT
      *
    FROM (SELECT
        a.EmployeeID,
        a.EmployeeCode,
        a.EmployeeNo,
        b.PositionID,
        d.Level AS PosLevel,
        b.FlgPart,
        b.UsefulFromDt AS PosUsefulFromDt,
        b.UsefulToDt AS PosUsefulToDt,
        c.OrgID,
        c.OrgCD,
        c.OrgLevel,
        a1.EmployeeID AS SEmployeeID,
        a1.EmployeeCode AS SEmployeeCode,
        a1.EmployeeNo AS SEmployeeNo,
        a1.NameCN AS SNameCN,
        a1.NameEN AS SNameEN,
        a1.NameJP AS SNameJP,
        c1.OrgID AS SOrgID,
        c1.OrgCD AS SOrgCD,
        c1.OrgLevel AS SOrgLevel,
        c1.NameCN AS SOrgNameCN,
        c1.NameEN AS SOrgNameEN,
        c1.NameJP AS SOrgNameJP,
        b1.PositionID AS SPositionID,
        d1.Level AS SPosLevel,
        b1.FlgPart AS SFlgPart
      FROM TrnEmployee a,
           RtnEmployeeOrg b,
           MstOrg c,
           MstPosition d,
           TrnEmployee a1,
           RtnEmployeeOrg b1,
           MstOrg c1,
           MstPosition d1
      WHERE a.EmployeeID = b.EmployeeID AND b.OrgCD = c.OrgCD AND b.UsefulFromDt >= c.UsefulFromDt AND b.UsefulToDt <= c.UsefulToDt AND b.PositionID = d.PositionID
      AND a1.EmployeeID = b1.EmployeeID AND b1.OrgCD = c1.OrgCD AND b1.UsefulFromDt >= c1.UsefulFromDt AND b1.UsefulToDt <= c1.UsefulToDt AND b1.PositionID = d1.PositionID
      AND b.OrgCD = b1.OrgCD AND d.Level > d1.Level
      AND a.DelFlg = '0' AND b.DelFlg = '0' AND c.DelFlg = '0'
      AND a1.DelFlg = '0' AND b1.DelFlg = '0' AND c1.DelFlg = '0') tb;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP PROCEDURE IF EXISTS ivggs_whs.procRefreshEmSubOne$$
CREATE
PROCEDURE ivggs_whs.procRefreshEmSubOne (IN inEmployeeID int)
BEGIN
  DELETE
    FROM TMP_EmSub
  WHERE EmployeeID = inEmployeeID;

  DELETE
    FROM TMP_EmSub
  WHERE SEmployeeID = inEmployeeID;

  INSERT INTO TMP_EmSub (EmployeeID, EmployeeCode, EmployeeNo, PositionID, PosLevel, FlgPart, PosUsefulFromDt, PosUsefulToDt, OrgID, OrgCD, OrgLevel, SEmployeeID, SEmployeeCode, SEmployeeNo, SNameCN, SNameEN, SNameJP, SOrgID, SOrgCD, SOrgLevel, SOrgNameCN, SOrgNameEN, SOrgNameJP, SPositionID, SPosLevel, SFlgPart)
    SELECT DISTINCT
      *
    FROM (SELECT
        a.EmployeeID,
        a.EmployeeCode,
        a.EmployeeNo,
        b.PositionID,
        g.Level AS PosLevel,
        b.FlgPart,
        b.UsefulFromDt AS PosUsefulFromDt,
        b.UsefulToDt AS PosUsefulToDt,
        c.OrgID,
        c.OrgCD,
        c.OrgLevel,
        e.EmployeeID AS SEmployeeID,
        e.EmployeeCode AS SEmployeeCode,
        e.EmployeeNo AS SEmployeeNo,
        f.NameCN AS SNameCN,
        f.NameEN AS SNameEN,
        f.NameJP AS SNameJP,
        d.OrgID AS SOrgID,
        d.OrgCD AS SOrgCD,
        d.OrgLevel AS SOrgLevel,
        d.OrgNameCN AS SOrgNameCN,
        d.OrgNameEN AS SOrgNameEN,
        d.OrgNameJP AS SOrgNameJP,
        e.PositionID AS SPositionID,
        e.Level AS SPosLevel,
        h.FlgPart AS SFlgPart
      FROM TrnEmployee a,
           RtnEmployeeOrg b,
           MstOrg c,
           TMP_Org d,
           TMP_EmOrg e,
           TrnEmployee f,
           MstPosition g,
           RtnEmployeeOrg h
      WHERE a.EmployeeID = inEmployeeID AND a.EmployeeID = b.EmployeeID AND b.OrgCD = c.OrgCD AND b.UsefulFromDt >= c.UsefulFromDt AND b.UsefulToDt <= c.UsefulToDt
      AND d.FOrgID = c.OrgID AND d.OrgID = e.OrgID AND e.EmployeeID = f.EmployeeID AND b.PositionID = g.PositionID AND g.Level > e.Level
      AND e.CurrentOrgID = e.OrgID AND f.EmployeeID = h.EmployeeID AND d.OrgCD = h.OrgCD
      AND a.DelFlg = '0' AND b.DelFlg = '0' AND c.DelFlg = '0' AND h.DelFlg = '0') tb;

  INSERT INTO TMP_EmSub (EmployeeID, EmployeeCode, EmployeeNo, PositionID, PosLevel, FlgPart, PosUsefulFromDt, PosUsefulToDt, OrgID, OrgCD, OrgLevel, SEmployeeID, SEmployeeCode, SEmployeeNo, SNameCN, SNameEN, SNameJP, SOrgID, SOrgCD, SOrgLevel, SOrgNameCN, SOrgNameEN, SOrgNameJP, SPositionID, SPosLevel, SFlgPart)
    SELECT DISTINCT
      *
    FROM (SELECT
        a.EmployeeID,
        a.EmployeeCode,
        a.EmployeeNo,
        b.PositionID,
        d.Level AS PosLevel,
        b.FlgPart,
        b.UsefulFromDt AS PosUsefulFromDt,
        b.UsefulToDt AS PosUsefulToDt,
        c.OrgID,
        c.OrgCD,
        c.OrgLevel,
        a1.EmployeeID AS SEmployeeID,
        a1.EmployeeCode AS SEmployeeCode,
        a1.EmployeeNo AS SEmployeeNo,
        a1.NameCN AS SNameCN,
        a1.NameEN AS SNameEN,
        a1.NameJP AS SNameJP,
        c1.OrgID AS SOrgID,
        c1.OrgCD AS SOrgCD,
        c1.OrgLevel AS SOrgLevel,
        c1.NameCN AS SOrgNameCN,
        c1.NameEN AS SOrgNameEN,
        c1.NameJP AS SOrgNameJP,
        b1.PositionID AS SPositionID,
        d1.Level AS SPosLevel,
        b1.FlgPart AS SFlgPart
      FROM TrnEmployee a,
           RtnEmployeeOrg b,
           MstOrg c,
           MstPosition d,
           TrnEmployee a1,
           RtnEmployeeOrg b1,
           MstOrg c1,
           MstPosition d1
      WHERE a.EmployeeID = inEmployeeID AND a.EmployeeID = b.EmployeeID AND b.OrgCD = c.OrgCD AND b.UsefulFromDt >= c.UsefulFromDt AND b.UsefulToDt <= c.UsefulToDt AND b.PositionID = d.PositionID
      AND a1.EmployeeID = b1.EmployeeID AND b1.OrgCD = c1.OrgCD AND b1.UsefulFromDt >= c1.UsefulFromDt AND b1.UsefulToDt <= c1.UsefulToDt AND b1.PositionID = d1.PositionID
      AND b.OrgCD = b1.OrgCD AND d.Level > d1.Level
      AND a.DelFlg = '0' AND b.DelFlg = '0' AND c.DelFlg = '0'
      AND a1.DelFlg = '0' AND b1.DelFlg = '0' AND c1.DelFlg = '0') tb;

  INSERT INTO TMP_EmSub (EmployeeID, EmployeeCode, EmployeeNo, PositionID, PosLevel, FlgPart, PosUsefulFromDt, PosUsefulToDt, OrgID, OrgCD, OrgLevel, SEmployeeID, SEmployeeCode, SEmployeeNo, SNameCN, SNameEN, SNameJP, SOrgID, SOrgCD, SOrgLevel, SOrgNameCN, SOrgNameEN, SOrgNameJP, SPositionID, SPosLevel, SFlgPart)
    SELECT DISTINCT
      *
    FROM (SELECT
        a.EmployeeID,
        a.EmployeeCode,
        a.EmployeeNo,
        b.PositionID,
        g.Level AS PosLevel,
        b.FlgPart,
        b.UsefulFromDt AS PosUsefulFromDt,
        b.UsefulToDt AS PosUsefulToDt,
        c.OrgID,
        c.OrgCD,
        c.OrgLevel,
        e.EmployeeID AS SEmployeeID,
        e.EmployeeCode AS SEmployeeCode,
        e.EmployeeNo AS SEmployeeNo,
        f.NameCN AS SNameCN,
        f.NameEN AS SNameEN,
        f.NameJP AS SNameJP,
        d.OrgID AS SOrgID,
        d.OrgCD AS SOrgCD,
        d.OrgLevel AS SOrgLevel,
        d.OrgNameCN AS SOrgNameCN,
        d.OrgNameEN AS SOrgNameEN,
        d.OrgNameJP AS SOrgNameJP,
        e.PositionID AS SPositionID,
        e.Level AS SPosLevel,
        h.FlgPart AS SFlgPart
      FROM TrnEmployee a,
           RtnEmployeeOrg b,
           MstOrg c,
           TMP_Org d,
           TMP_EmOrg e,
           TrnEmployee f,
           MstPosition g,
           RtnEmployeeOrg h
      WHERE e.EmployeeID = inEmployeeID AND a.EmployeeID <> inEmployeeID AND a.EmployeeID = b.EmployeeID AND b.OrgCD = c.OrgCD AND b.UsefulFromDt >= c.UsefulFromDt AND b.UsefulToDt <= c.UsefulToDt
      AND d.FOrgID = c.OrgID AND d.OrgID = e.OrgID AND e.EmployeeID = f.EmployeeID AND b.PositionID = g.PositionID AND g.Level > e.Level
      AND e.CurrentOrgID = e.OrgID AND f.EmployeeID = h.EmployeeID AND d.OrgCD = h.OrgCD
      AND a.DelFlg = '0' AND b.DelFlg = '0' AND c.DelFlg = '0' AND h.DelFlg = '0') tb;

  INSERT INTO TMP_EmSub (EmployeeID, EmployeeCode, EmployeeNo, PositionID, PosLevel, FlgPart, PosUsefulFromDt, PosUsefulToDt, OrgID, OrgCD, OrgLevel, SEmployeeID, SEmployeeCode, SEmployeeNo, SNameCN, SNameEN, SNameJP, SOrgID, SOrgCD, SOrgLevel, SOrgNameCN, SOrgNameEN, SOrgNameJP, SPositionID, SPosLevel, SFlgPart)
    SELECT DISTINCT
      *
    FROM (SELECT
        a.EmployeeID,
        a.EmployeeCode,
        a.EmployeeNo,
        b.PositionID,
        d.Level AS PosLevel,
        b.FlgPart,
        b.UsefulFromDt AS PosUsefulFromDt,
        b.UsefulToDt AS PosUsefulToDt,
        c.OrgID,
        c.OrgCD,
        c.OrgLevel,
        a1.EmployeeID AS SEmployeeID,
        a1.EmployeeCode AS SEmployeeCode,
        a1.EmployeeNo AS SEmployeeNo,
        a1.NameCN AS SNameCN,
        a1.NameEN AS SNameEN,
        a1.NameJP AS SNameJP,
        c1.OrgID AS SOrgID,
        c1.OrgCD AS SOrgCD,
        c1.OrgLevel AS SOrgLevel,
        c1.NameCN AS SOrgNameCN,
        c1.NameEN AS SOrgNameEN,
        c1.NameJP AS SOrgNameJP,
        b1.PositionID AS SPositionID,
        d1.Level AS SPosLevel,
        b1.FlgPart AS SFlgPart
      FROM TrnEmployee a,
           RtnEmployeeOrg b,
           MstOrg c,
           MstPosition d,
           TrnEmployee a1,
           RtnEmployeeOrg b1,
           MstOrg c1,
           MstPosition d1
      WHERE a1.EmployeeID = inEmployeeID AND a.EmployeeID = b.EmployeeID AND b.OrgCD = c.OrgCD AND b.UsefulFromDt >= c.UsefulFromDt AND b.UsefulToDt <= c.UsefulToDt AND b.PositionID = d.PositionID
      AND a1.EmployeeID = b1.EmployeeID AND b1.OrgCD = c1.OrgCD AND b1.UsefulFromDt >= c1.UsefulFromDt AND b1.UsefulToDt <= c1.UsefulToDt AND b1.PositionID = d1.PositionID
      AND b.OrgCD = b1.OrgCD AND d.Level > d1.Level
      AND a.DelFlg = '0' AND b.DelFlg = '0' AND c.DelFlg = '0'
      AND a1.DelFlg = '0' AND b1.DelFlg = '0' AND c1.DelFlg = '0') tb;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP PROCEDURE IF EXISTS ivggs_whs.procRefreshOrg$$
CREATE
PROCEDURE ivggs_whs.procRefreshOrg ()
BEGIN
  DECLARE varOrgTableCount,
          varOrgID,
          varFOrgID int;
  DECLARE varno_more_record int DEFAULT 0;

  /* 定义当前记录内容  */
  DECLARE varOrgLevel int;
  DECLARE varOrgCD varchar(64);
  DECLARE varNameCN,
          varNameEN,
          varNameJP varchar(256);
  DECLARE varUsefulFromDt,
          varUsefulToDt char(8);
  DECLARE curOrg CURSOR FOR
  SELECT
    m.OrgID,
    m.ParentID,
    m.OrgCD,
    m.OrgLevel,
    m.NameCN,
    m.NameEN,
    m.NameJP,
    m.UsefulFromDt,
    m.UsefulToDt
  FROM ivggs_whs.MstOrg m
  WHERE m.DelFlg = '0';
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET varno_more_record = 1; /*when "not found" occur,just continue,这个是个条件处理,针对NOT FOUND的条件*/


  SELECT
    COUNT(*) INTO varOrgTableCount
  FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = 'ivggs_whs' AND TABLE_NAME = 'TMP_Org';
  IF varOrgTableCount > 0 THEN
    DROP TABLE ivggs_whs.TMP_Org;
  END IF;

  CREATE TABLE ivggs_whs.TMP_Org (
    OrgID int,
    OrgCD varchar(64),
    OrgLevel int,
    OrgNameCN varchar(256),
    OrgNameEN varchar(256),
    OrgNameJP varchar(256),
    UsefulFromDt char(8),
    UsefulToDt char(8),
    FOrgID int,
    FOrgCD varchar(64),
    FOrgLevel int,
    FOrgNameCN varchar(256),
    FOrgNameEN varchar(256),
    FOrgNameJP varchar(256)
  ) ENGINE = INNODB;


  OPEN curOrg;
LBL_LOOP:
LOOP
  FETCH curOrg INTO varOrgID, varFOrgID, varOrgCD, varOrgLevel, varNameCN, varNameEN, varNameJP, varUsefulFromDt, varUsefulToDt;
  IF varno_more_record = 1 THEN
    LEAVE LBL_LOOP;
  END IF;

  REPEAT
    IF varFOrgID = 0 THEN
      INSERT INTO ivggs_whs.TMP_Org (OrgID, OrgCD, OrgLevel, OrgNameCN, OrgNameEN, OrgNameJP, UsefulFromDt, UsefulToDt, FOrgID)
        VALUES (varOrgID, varOrgCD, varOrgLevel, varNameCN, varNameEN, varNameJP, varUsefulFromDt, varUsefulToDt, 0);
    ELSE
      INSERT INTO ivggs_whs.TMP_Org (OrgID, OrgCD, OrgLevel, OrgNameCN, OrgNameEN, OrgNameJP, UsefulFromDt, UsefulToDt, FOrgID, FOrgCD, FOrgLevel, FOrgNameCN, FOrgNameEN, FOrgNameJP)
        SELECT
          varOrgID AS OrgID,
          varOrgCD AS OrgCD,
          varOrgLevel AS OrgLevel,
          varNameCN AS OrgNameCN,
          varNameEN AS OrgNameEN,
          varNameJP AS OrgNameJP,
          varUsefulFromDt AS UsefulFromDt,
          varUsefulToDt AS UsefulToDt,
          m.OrgID AS FOrgID,
          m.OrgCD AS FOrgCD,
          m.OrgLevel AS FOrgLevel,
          m.NameCN AS FOrgNameCN,
          m.NameEN AS FOrgNameEN,
          m.NameJP AS FOrgNameJP
        FROM ivggs_whs.MstOrg m
        WHERE m.OrgID = varFOrgID;

      SELECT
        m.ParentID INTO varFOrgID
      FROM ivggs_whs.MstOrg m
      WHERE m.OrgID = varFOrgID;

    END IF;


  UNTIL varFOrgID = 0
  END REPEAT;


END LOOP LBL_LOOP;
  CLOSE curOrg;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP PROCEDURE IF EXISTS ivggs_whs.procRejectWHWF$$
CREATE
PROCEDURE ivggs_whs.procRejectWHWF (IN inObjYMD char(8), IN inWFType int, IN inTableKey int, IN inUserID int, IN inOrgCD varchar(64), IN inPositionID int, OUT outResult int)
LBL_EXIT:
BEGIN
  /**
  **驳回考勤审批流程
  输入参数：	wfType INT 流程类型；取业务字典FlowType值：2加班；3休假	
	tableKey  INT 相关表单主键	
	userID INT 提交用户员工ID	
	orgCD Char 提交用户当前的组织编码	
	positionID INT 提交用户的职位ID	
	memo  Varchar(512) 说明	

  返回参数：	result INT
	1：成功
	-1:流程类型不符
	-2:无效流程（相关tableKey无法找到EmployeeID）
	-100:SQL执行错误；
  **/
  DECLARE vDes varchar(128);
  DECLARE vEmployeeID int;
  DECLARE vWFStepBasicIDS varchar(2048);
  DECLARE vNextWFStepID int;
  DECLARE vWFStepBasicIDStr varchar(64);
  DECLARE vRecCnt int;
  DECLARE vIndex int;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION SET outResult = - 100;

  IF inWFType = 2 THEN
    /**根据加班信息取得提交员工ID**/
    SELECT
      t.EmployeeID INTO vEmployeeID
    FROM TrnOVForm t
    WHERE t.OVFormID = inTableKey AND t.DelFlg = '0';

    IF vEmployeeID IS NULL THEN
      SET outResult = - 2;
      LEAVE LBL_EXIT;
    END IF;

    SET vDes = '加班驳回连带操作';

    /**取得相关考勤工作流信息**/
    SELECT
      GROUP_CONCAT(a.WFStepBasicID SEPARATOR ',') INTO vWFStepBasicIDS
    FROM TrnWFStepBasic a,
         TrnWHForm b
    WHERE LOWER(a.AppTableName) = 'trnwhform' AND a.AppKey = b.WHFormID
    AND a.AppEmID = vEmployeeID AND b.ObjYMD = inObjYMD;

  ELSE
    IF inWFType = 3 THEN
      /**根据休假信息取得提交员工ID**/
      SELECT
        t.EmployeeID INTO vEmployeeID
      FROM TrnVCForm t
      WHERE t.VCFormID = inTableKey AND t.DelFlg = '0';

      IF vEmployeeID IS NULL THEN
        SET outResult = - 2;
        LEAVE LBL_EXIT;
      END IF;

      SET vDes = '休假驳回连带操作';

      /**取得相关考勤工作流信息**/
      SELECT
        GROUP_CONCAT(a.WFStepBasicID SEPARATOR ',') INTO vWFStepBasicIDS
      FROM TrnWFStepBasic a,
           TrnWHForm b
      WHERE LOWER(a.AppTableName) = 'trnwhform' AND a.AppKey = b.WHFormID
      AND a.AppEmID = vEmployeeID AND b.ObjYMD IN (SELECT
          t1.ObjYMD
        FROM TrnVCForm t,
             TrnVCFormDetail t1
        WHERE t.VCFormID = t1.VCFormID AND t.EmployeeID = vEmployeeID AND t.DelFlg = '0'
        AND t.VCFormID = inTableKey
        GROUP BY t1.ObjYMD);

    ELSE
      SET outResult = - 1;
      LEAVE LBL_EXIT;
    END IF;
  END IF;

  IF vWFStepBasicIDS IS NULL THEN
    SET outResult = 1;
    LEAVE LBL_EXIT;
  END IF;

  SET vWFStepBasicIDS = CONCAT(vWFStepBasicIDS, ',');

  /**筛选进行中流程**/
  SELECT
    GROUP_CONCAT(a.WFStepBasicID SEPARATOR ',') INTO vWFStepBasicIDS
  FROM TrnWFStepBasic a,
       TrnWFDetail b
  WHERE a.WFStepBasicID = b.WFStepBasicID AND a.DelFlg = '0' AND b.FlgApprove > 0 AND b.FlgReject > 0
  AND LOCATE(CONCAT(',', a.WFStepBasicID, ','), CONCAT(',', vWFStepBasicIDS)) > 0 AND b.DtWFStatus IN (1, 2, 3);

  /**更新进行中流程为12【已固定（驳回）】**/
  UPDATE TrnWFDetail
  SET DtWFStatus = 12,
      OptID = inUserID,
      OptPositionID = inPositionID,
      OptOrgCD = inOrgCD,
      OpeDes = vDes,
      OptTime = CURRENT_TIMESTAMP()
  WHERE FlgApprove > 0 AND FlgReject > 0
  AND LOCATE(CONCAT(',', WFStepBasicID, ','), CONCAT(',', vWFStepBasicIDS)) > 0;

  /**更新流程为完结2**/
  UPDATE TrnWFStepBasic
  SET DtWFStatus = 2,
      UpdateTime = CURRENT_TIMESTAMP(),
      UpdateBy = inUserID
  WHERE LOCATE(CONCAT(',', WFStepBasicID, ','), CONCAT(',', vWFStepBasicIDS)) > 0;

  /**更新考勤表状态**/
  UPDATE TrnWHForm
  SET DtAppStatus = 3
  WHERE WHFormID IN (SELECT
      AppKey
    FROM TrnWFStepBasic
    WHERE LOCATE(CONCAT(',', WFStepBasicID, ','), CONCAT(',', vWFStepBasicIDS)) > 0);

  SET outResult = 1;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP PROCEDURE IF EXISTS ivggs_whs.procResetWHWF2First$$
CREATE
PROCEDURE ivggs_whs.procResetWHWF2First (IN inObjYMD char(8), IN inWFType int, IN inTableKey int, IN inUserID int, IN inOrgCD varchar(64), IN inPositionID int, OUT outResult int)
LBL_EXIT:
BEGIN
  /**
  **重置考勤审批流程到初始状态
  输入参数：	wfType INT 流程类型；取业务字典FlowType值：2加班；3休假	
	tableKey  INT 相关表单主键	
	userID INT 提交用户员工ID	
	orgCD Char 提交用户当前的组织编码	
	positionID INT 提交用户的职位ID	
	memo  Varchar(512) 说明	

  返回参数：	result INT
	1：成功
	-1:流程类型不符
	-2:无效流程（相关tableKey无法找到EmployeeID）
	-100:SQL执行错误；
  **/
  DECLARE vDes varchar(128);
  DECLARE vEmployeeID int;
  DECLARE vWFStepBasicIDS varchar(2048);
  DECLARE vNextWFStepID int;
  DECLARE vWFStepBasicIDStr varchar(64);
  DECLARE vRecCnt int;
  DECLARE vIndex int;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION SET outResult = - 100;

  IF inWFType = 2 THEN
    /**根据加班信息取得提交员工ID**/
    SELECT
      t.EmployeeID INTO vEmployeeID
    FROM TrnOVForm t
    WHERE t.OVFormID = inTableKey AND t.DelFlg = '0';

    IF vEmployeeID IS NULL THEN
      SET outResult = - 2;
      LEAVE LBL_EXIT;
    END IF;

    SET vDes = '加班承认取消连带操作';

    /**取得相关考勤工作流信息**/
    SELECT
      GROUP_CONCAT(a.WFStepBasicID SEPARATOR ',') INTO vWFStepBasicIDS
    FROM TrnWFStepBasic a,
         TrnWHForm b
    WHERE LOWER(a.AppTableName) = 'trnwhform' AND a.AppKey = b.WHFormID
    AND a.AppEmID = vEmployeeID AND b.ObjYMD = inObjYMD;

  ELSE
    IF inWFType = 3 THEN
      /**根据休假信息取得提交员工ID**/
      SELECT
        t.EmployeeID INTO vEmployeeID
      FROM TrnVCForm t
      WHERE t.VCFormID = inTableKey AND t.DelFlg = '0';

      IF vEmployeeID IS NULL THEN
        SET outResult = - 2;
        LEAVE LBL_EXIT;
      END IF;

      SET vDes = '休假承认取消连带操作';

      /**取得相关考勤工作流信息**/
      SELECT
        GROUP_CONCAT(a.WFStepBasicID SEPARATOR ',') INTO vWFStepBasicIDS
      FROM TrnWFStepBasic a,
           TrnWHForm b
      WHERE LOWER(a.AppTableName) = 'trnwhform' AND a.AppKey = b.WHFormID
      AND a.AppEmID = vEmployeeID AND b.ObjYMD IN (SELECT
          t1.ObjYMD
        FROM TrnVCForm t,
             TrnVCFormDetail t1
        WHERE t.VCFormID = t1.VCFormID AND t.EmployeeID = vEmployeeID AND t.DelFlg = '0'
        AND t.VCFormID = inTableKey
        GROUP BY t1.ObjYMD);

    ELSE
      SET outResult = - 1;
      LEAVE LBL_EXIT;
    END IF;
  END IF;

  IF vWFStepBasicIDS IS NULL THEN
    SET outResult = 1;
    LEAVE LBL_EXIT;
  END IF;

  SET vWFStepBasicIDS = CONCAT(vWFStepBasicIDS, ',');

  /**筛选进行中流程**/
  SELECT
    GROUP_CONCAT(a.WFStepBasicID SEPARATOR ',') INTO vWFStepBasicIDS
  FROM TrnWFStepBasic a,
       TrnWFDetail b
  WHERE a.WFStepBasicID = b.WFStepBasicID AND a.DelFlg = '0' AND b.FlgApprove > 0 AND b.FlgReject > 0
  AND LOCATE(CONCAT(',', a.WFStepBasicID, ','), CONCAT(',', vWFStepBasicIDS)) > 0 AND b.DtWFStatus IN (1, 2, 3);

  /**更新进行中流程为11【已固定（取消）】**/
  UPDATE TrnWFDetail
  SET DtWFStatus = 11,
      OptID = inUserID,
      OptPositionID = inPositionID,
      OptOrgCD = inOrgCD,
      OpeDes = vDes,
      OptTime = CURRENT_TIMESTAMP()
  WHERE FlgApprove > 0 AND FlgReject > 0
  AND LOCATE(CONCAT(',', WFStepBasicID, ','), CONCAT(',', vWFStepBasicIDS)) > 0;

  /**更新流程为进行中1**/
  UPDATE TrnWFStepBasic
  SET DtWFStatus = 1,
      UpdateTime = CURRENT_TIMESTAMP(),
      UpdateBy = inUserID
  WHERE LOCATE(CONCAT(',', WFStepBasicID, ','), CONCAT(',', vWFStepBasicIDS)) > 0;

  /**更新考勤表状态**/
  UPDATE TrnWHForm
  SET DtAppStatus = 1
  WHERE WHFormID IN (SELECT
      AppKey
    FROM TrnWFStepBasic
    WHERE LOCATE(CONCAT(',', WFStepBasicID, ','), CONCAT(',', vWFStepBasicIDS)) > 0);

  /**取得下一步流程ID**/
  /**
  DECLARE vNextWFStepID int;
  DECLARE vWFStepBasicID int;
  DECLARE vWFStepBasicIDStr varchar(64);
  DECLARE vRecCnt int;
  DECLARE vIndex int;
**/
  SET vIndex = 1;
  SET vRecCnt = fnGetStrArrayLength(vWFStepBasicIDS, ',');
  SET vWFStepBasicIDStr = fnGetStrArrayAtIndex(vWFStepBasicIDS, ',', vIndex, FALSE);
  WHILE vIndex <= vRecCnt DO
    IF LENGTH(vWFStepBasicIDStr) > 0 THEN
      SELECT
        t.NextWFStepID
      FROM TrnWFDetail t
      WHERE t.WFStepBasicID = vWFStepBasicIDStr AND t.FlgApprove = 0 AND t.FlgReject > 0;

      INSERT INTO TrnWFDetail (WFStepBasicID, WFCD, FlowName, FlowNo, CurrentWFStepID, RejectWFStepID, NextWFStepID, FlgApprove, FlgReject, DtWFStatus, OptID, OptPositionID, OptOrgCD, OptTime, OpeDes, CreateTime, UpdateTime)
        SELECT
          vWFStepBasicIDStr,
          CONCAT(inWFType, '_', inUserID, '_', inObjYMD),
          m.StepName,
          m.StepNo,
          m.WFStepID,
          m.RejectStepID,
          m.NextStepID,
          m.FlgApprove,
          m.FlgReject,
          1,
          0,
          r.PositionID,
          r.OrgCD,
          NULL,
          NULL,
          CURRENT_TIMESTAMP(),
          CURRENT_TIMESTAMP()
        FROM MstWFStep m,
             RtnWFPosition r
        WHERE m.WFStepID = r.WFStepID AND m.WFExtID = r.WFExtID AND m.WFStepID = NextWFStepID;
    END IF;
    SET vIndex = vIndex + 1;
    SET vWFStepBasicIDStr = fnGetStrArrayAtIndex(vWFStepBasicIDS, ',', vIndex, FALSE);
  END WHILE;


  SET outResult = 1;

END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP PROCEDURE IF EXISTS ivggs_whs.procWFConfirm$$
CREATE
PROCEDURE ivggs_whs.procWFConfirm (IN inObjYMD char(8), IN inWFType int, IN inTableKey int, IN inUserID int, IN inOrgCD varchar(64), IN inPositionID int
, IN inMemo varchar(512), OUT outResult int)
LBL_EXIT:
BEGIN
  /**
  输入参数： wfType INT 流程类型；取业务字典FlowType值：1工时；2加班；3休假  
  tableKey  INT 相关表单主键  
  userID INT 审核用户员工ID 
  orgCD Char 审核用户当前的组织编码  
  positionID INT 审核用户的职位ID  
  memo  Varchar(512) 说明 
返回参数： result INT
  1：成功
  -1:当前没有流程定义
  -2:工时审核时，有未通过审核的加班信息
  -3:工时审核时，有未通过审核的休假信息  
  -100:SQL执行错误；
  **/
  DECLARE vTargetWFBasicID int;
  DECLARE vTargetDetails varchar(1024);
  DECLARE vTargetDetailsProxy varchar(512);
  DECLARE vTargetDetailsExculde varchar(512);
  DECLARE vTempIDs varchar(1024);
  DECLARE vTempID int;
  DECLARE vTempTableName varchar(128);
  DECLARE vTempKeyName varchar(128);
  DECLARE vTempKeyID int;
  DECLARE vCheckResult int;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION SET outResult = - 100;

  SELECT
    t.WFStepBasicID INTO vTargetWFBasicID
  FROM TrnWFStepBasic t
  WHERE t.DWFType = inWFType AND t.AppKey = inTableKey AND t.DtWFStatus = 1 AND t.FlgNew = 1
  ORDER BY t.UpdateTime DESC LIMIT 1;
  IF vTargetWFBasicID IS NULL THEN
    SET outResult = - 1;
    LEAVE LBL_EXIT;
  END IF;

  /*** 修正用户的组织编码和职位ID 因用户可能有多个职位，传入的为用户的主职，其他职位可能有审批权 ***/
  SELECT
    c.OptOrgCD,
    c.OptPositionID INTO inOrgCD, inPositionID
  FROM RtnEmployeeOrg a,
       TrnWFStepBasic b,
       TrnWFDetail c
  WHERE a.EmployeeID = inUserID AND b.WFStepBasicID = c.WFStepBasicID AND b.WFStepBasicID = vTargetWFBasicID
  AND b.AppKey = inTableKey AND b.DWFType = inWFType AND c.DtWFStatus IN (1, 3) AND b.FlgNew = 1
  AND a.PositionID = c.OptPositionID AND a.OrgCD = c.OptOrgCD
  ORDER BY c.UpdateTime DESC LIMIT 1;

  IF ISNULL(inOrgCD) = 1 OR ISNULL(inPositionID) = 1 THEN
    SET outResult = - 1;
    LEAVE LBL_EXIT;
  END IF;

  /**1.查询当前用户是否有审批权**/
  /**1.1 直接审批权**/
  SELECT
    GROUP_CONCAT(CONVERT(t.WFDetailID, char) SEPARATOR ',') INTO vTargetDetails
  FROM (SELECT
      e.WFDetailID
    FROM VW_ConfirmWFInfo a,
         RtnEmployeeOrg b,
         MstPosition c,
         TrnWFStepBasic d,
         TrnWFDetail e,
         VW_CommitWFInfo h
    WHERE a.PositionID = b.PositionID AND a.OrgCD = b.OrgCD AND b.PositionID = c.PositionID
    AND d.WFStepBasicID = e.WFStepBasicID AND e.CurrentWFStepID = a.WFStepID
    AND d.DtWFStatus = 1 AND d.AppTableName = a.TableName AND d.AppKeyName = a.KeyName AND d.AppKey = inTableKey
    AND d.DWFType = a.DWFType AND d.DWFType = inWFType AND e.DtWFStatus IN (1, 3) AND d.FlgNew = 1
    AND a.FlgApproveStep = 1 AND a.PositionID = inPositionID AND a.OrgCD = inOrgCD
    AND inObjYMD >= a.DtFrom AND inObjYMD <= a.DtTo AND inObjYMD >= b.UsefulFromDt AND inObjYMD <= b.UsefulToDt
    AND c.FlgCanApprove = 1 AND b.EmployeeID = inUserID AND d.WFStepBasicID = vTargetWFBasicID
    AND d.AppEmPositionID = h.PositionID AND d.AppEmOrgCD = h.OrgCD AND d.DWFType = h.DWFType AND a.WFExtID = h.WFExtID
    GROUP BY e.WFDetailID) t;

  IF vTargetDetails IS NULL THEN
    SET vTargetDetails = '';
  END IF;

  /**1.2 代理审批权**/
  SELECT
    GROUP_CONCAT(CONVERT(t.WFDetailID, char) SEPARATOR ',') INTO vTargetDetailsProxy
  FROM (SELECT
      e.WFDetailID
    FROM VW_ConfirmWFInfo a,
         RtnEmployeeOrg b,
         MstPosition c,
         TrnWFStepBasic d,
         TrnWFDetail e,
         VW_ProxyInfo f,
         VW_CommitWFInfo h
    WHERE a.PositionID = b.PositionID AND a.OrgCD = b.OrgCD AND b.PositionID = c.PositionID
    AND d.WFStepBasicID = e.WFStepBasicID AND e.CurrentWFStepID = a.WFStepID
    AND d.DtWFStatus = 1 AND d.AppTableName = a.TableName AND d.AppKeyName = a.KeyName AND d.AppKey = inTableKey
    AND d.DWFType = a.DWFType AND d.DWFType = inWFType AND e.DtWFStatus IN (1, 3) AND d.FlgNew = 1
    AND a.FlgApproveStep = 1 /** AND a.PositionID = inPositionID AND a.OrgCD = inOrgCD **/
    AND inObjYMD >= a.DtFrom AND inObjYMD <= a.DtTo AND inObjYMD >= b.UsefulFromDt AND inObjYMD <= b.UsefulToDt AND inObjYMD >= f.FromDt AND inObjYMD <= f.ToDt
    AND f.WFStepID = a.WFStepID AND f.ClientID = b.EmployeeID AND f.AgentID = inUserID AND f.EmployeeID = d.AppEmID
    AND c.FlgCanApprove = 1 AND d.WFStepBasicID = vTargetWFBasicID
    AND d.AppEmPositionID = h.PositionID AND d.AppEmOrgCD = h.OrgCD AND d.DWFType = h.DWFType AND a.WFExtID = h.WFExtID
    GROUP BY e.WFDetailID) t;
  IF vTargetDetailsProxy IS NULL THEN
    SET vTargetDetailsProxy = '';
  END IF;

  /**若1.1 存在流程则进行1.3操作  **/
  /**1.3 排除已经被代理出去且共享标志为不共享的流程  **/
  IF LENGTH(vTargetDetails) > 0 THEN
    SELECT
      GROUP_CONCAT(CONVERT(t.WFDetailID, char) SEPARATOR ',') INTO vTargetDetailsExculde
    FROM (SELECT
        e.WFDetailID
      FROM VW_ConfirmWFInfo a,
           RtnEmployeeOrg b,
           MstPosition c,
           TrnWFStepBasic d,
           TrnWFDetail e,
           VW_ProxyInfo f,
           VW_CommitWFInfo h
      WHERE a.PositionID = b.PositionID AND a.OrgCD = b.OrgCD AND b.PositionID = c.PositionID
      AND d.WFStepBasicID = e.WFStepBasicID AND e.CurrentWFStepID = a.WFStepID
      AND d.DtWFStatus = 1 AND d.AppTableName = a.TableName AND d.AppKeyName = a.KeyName AND d.AppKey = inTableKey
      AND d.DWFType = a.DWFType AND d.DWFType = inWFType AND e.DtWFStatus IN (1, 3) AND d.FlgNew = 1
      AND a.FlgApproveStep = 1 AND a.PositionID = inPositionID AND a.OrgCD = inOrgCD
      AND inObjYMD >= a.DtFrom AND inObjYMD <= a.DtTo AND inObjYMD >= b.UsefulFromDt AND inObjYMD <= b.UsefulToDt AND inObjYMD >= f.FromDt AND inObjYMD <= f.ToDt
      AND f.WFStepID = a.WFStepID AND f.ClientID = b.EmployeeID AND f.ClientID = inUserID AND f.EmployeeID = d.AppEmID AND f.FlgShare = 2
      AND c.FlgCanApprove = 1 AND d.WFStepBasicID = vTargetWFBasicID
      AND d.AppEmPositionID = h.PositionID AND d.AppEmOrgCD = h.OrgCD AND d.DWFType = h.DWFType AND a.WFExtID = h.WFExtID
      GROUP BY e.WFDetailID) t;
    IF vTargetDetailsExculde IS NULL THEN
      SET vTargetDetailsExculde = '';
    END IF;

    IF LENGTH(vTargetDetailsExculde) > 0 THEN
      SET vTargetDetails = fnReplaceStrArray(vTargetDetails, vTargetDetailsExculde, ',', '');
    END IF;

  END IF;
  /**1.4 流程存在判断 **/


  IF LENGTH(vTargetDetails) = 0 AND LENGTH(vTargetDetailsProxy) = 0 THEN
    SET outResult = - 1;
    LEAVE LBL_EXIT;
  END IF;

  /**2.处理当前工作流**/
  /** 2.0 若为工时审核，则校验相关休假和加班申请都为终审状态 **/
  /**   -2：工时审核时，有未通过审核的加班信息 **/
  /**   -3: 工时审核时，有未通过审核的休假信息  **/
  IF inWFType = 1 THEN
    SET vCheckResult = fnIsOVFinish(inObjYMD, inTableKey);
    IF vCheckResult = - 100 THEN
      SET outResult = - 100;
      LEAVE LBL_EXIT;
    END IF;
    IF vCheckResult != 1 THEN
      SET outResult = - 2;
      LEAVE LBL_EXIT;
    END IF;

    SET vCheckResult = fnIsVCFinish(inObjYMD, inTableKey);
    IF vCheckResult = - 100 THEN
      SET outResult = - 100;
      LEAVE LBL_EXIT;
    END IF;
    IF vCheckResult != 1 THEN
      SET outResult = - 3;
      LEAVE LBL_EXIT;
    END IF;
  END IF;

  /**2.1 若1.1工作流程ID存在，则**/
  IF LENGTH(vTargetDetails) > 0 THEN
    SET vTargetDetails = CONCAT(vTargetDetails, ',');
    UPDATE TrnWFDetail t
    SET t.DtWFStatus = 2,
        t.OptID = inUserID,
        t.OptTime = CURRENT_TIMESTAMP(),
        t.OpeDes = inMemo,
        t.UpdateTime = CURRENT_TIMESTAMP()
    WHERE t.DtWFStatus IN (1, 3) AND t.WFStepBasicID = vTargetWFBasicID AND LOCATE(CONCAT(',', t.WFDetailID, ','), CONCAT(',', vTargetDetails)) > 0;
  END IF;

  /**2.2 若1.2工作流程ID存在，则**/
  IF LENGTH(vTargetDetailsProxy) > 0 THEN
    SET vTargetDetailsProxy = CONCAT(vTargetDetailsProxy, ',');
    INSERT INTO TrnWFProxy (WFDetailID, AgentID, ClientID)
      SELECT
        b.WFDetailID,
        c.AgentID,
        c.ClientID
      FROM TrnWFStepBasic a,
           TrnWFDetail b,
           VW_ProxyInfo c
      WHERE a.WFStepBasicID = b.WFStepBasicID AND c.WFStepID = b.CurrentWFStepID
      AND c.AgentID = inUserID AND c.EmployeeID = a.AppEmID AND a.WFStepBasicID = vTargetWFBasicID
      AND inObjYMD >= c.FromDt AND inObjYMD <= c.ToDt AND b.DtWFStatus IN (1, 3) AND a.FlgNew = 1
      AND LOCATE(CONCAT(',', b.WFDetailID, ','), CONCAT(',', vTargetDetailsProxy)) > 0
      GROUP BY b.WFDetailID,
               c.AgentID,
               c.ClientID;

    UPDATE TrnWFDetail t
    SET t.DtWFStatus = 2,
        t.OptID = inUserID,
        t.OptPositionID = inPositionID,
        t.OptOrgCD = inOrgCD,
        t.OptTime = CURRENT_TIMESTAMP(),
        t.UpdateTime = CURRENT_TIMESTAMP()
    WHERE t.DtWFStatus IN (1, 3) AND LOCATE(CONCAT(',', t.WFDetailID, ','), CONCAT(',', vTargetDetailsProxy)) > 0 AND t.WFStepBasicID = vTargetWFBasicID;
  END IF;
  /**2.3 更新工作流程，更新可能的并行审批流程**/
  SET vTargetDetails = CONCAT(vTargetDetails, ',', vTargetDetailsProxy);
  SELECT
    GROUP_CONCAT(CONVERT(m.CurrentWFStepID, char) SEPARATOR ',') INTO vTempIDs
  FROM (SELECT
      t.CurrentWFStepID
    FROM TrnWFDetail t
    WHERE LOCATE(CONCAT(',', t.WFDetailID, ','), CONCAT(',', vTargetDetails)) > 0 AND t.WFStepBasicID = vTargetWFBasicID
    GROUP BY t.CurrentWFStepID) m;

  SET vTempIDs = CONCAT(vTempIDs, ',');

  UPDATE TrnWFDetail t
  SET t.DtWFStatus = 2,
      t.OptTime = CURRENT_TIMESTAMP(),
      t.UpdateTime = CURRENT_TIMESTAMP()
  WHERE t.DtWFStatus IN (1, 3) AND LOCATE(CONCAT(',', t.CurrentWFStepID, ','), CONCAT(',', vTempIDs)) > 0 AND t.WFStepBasicID = vTargetWFBasicID;

  /**3.插入下一步流程 **/
  /**3.1 插入工作流程表，针对中间审批环节 **/
  /** 注意：这里略过【排除未全通过的工作流程】 因本系统中不存部分通过的情形只有任一通过的情形**/

  INSERT INTO TrnWFDetail (WFStepBasicID, WFCD, FlowName, FlowNo, CurrentWFStepID, RejectWFStepID, NextWFStepID, FlgApprove, FlgReject, DtWFStatus, OptID, OptPositionID, OptOrgCD, OptTime, OpeDes, CreateTime, UpdateTime)
    SELECT
      a.WFStepBasicID,
      a.WFCD,
      b.StepName,
      b.StepNo,
      b.WFStepID,
      b.RejectStepID,
      b.NextStepID,
      b.FlgApprove,
      b.FlgReject,
      1,
      0,
      c.PositionID,
      c.OrgCD,
      NULL,
      NULL,
      CURRENT_TIMESTAMP(),
      CURRENT_TIMESTAMP()
    FROM TrnWFDetail a,
         MstWFStep b,
         RtnWFPosition c
    WHERE a.WFStepBasicID = vTargetWFBasicID AND a.NextWFStepID = b.WFStepID AND b.WFStepID = c.WFStepID AND b.FlgApproveStep = 1
    AND b.WFExtID = c.WFExtID
    AND LOCATE(CONCAT(',', a.WFDetailID, ','), CONCAT(',', vTargetDetails)) > 0;

  /**3.2 锁定前步流程**/
  UPDATE TrnWFDetail
  SET DtWFStatus = 10,
      UpdateTime = CURRENT_TIMESTAMP()
  WHERE WFStepBasicID = vTargetWFBasicID AND LOCATE(CONCAT(',', NextWFStepID, ','), CONCAT(',', vTempIDs)) > 0;

  /**3.3 针对完结步骤标志，处理流程状态 **/
  SELECT
    t.WFStepBasicID INTO vTempID
  FROM (SELECT
      b.WFStepBasicID
    FROM MstWFStep a,
         TrnWFDetail b
    WHERE a.WFStepID = b.CurrentWFStepID AND LOCATE(CONCAT(',', b.WFDetailID, ','), CONCAT(',', vTargetDetails)) > 0
    AND a.FlgEndStep = 1
    GROUP BY b.WFStepBasicID) t LIMIT 1;

  IF vTempID IS NOT NULL THEN
    UPDATE TrnWFStepBasic
    SET DtWFStatus = 2,
        UpdateTime = CURRENT_TIMESTAMP(),
        UpdateBy = inUserID
    WHERE WFStepBasicID = vTempID;

    SELECT
      t.AppTableName,
      t.AppKeyName,
      t.AppKey INTO vTempTableName, vTempKeyName, vTempKeyID
    FROM TrnWFStepBasic t
    WHERE t.WFStepBasicID = vTempID;

    SET @uSQL = ' UPDATE @tablename
    SET DtAppStatus = 2,
        UpdateTime = CURRENT_TIMESTAMP(),
        UpdateBy = @inUserID
    WHERE @tablekey = @keyid';
    SET @uSQL = REPLACE(@uSQL, '@tablename', vTempTableName);
    SET @uSQL = REPLACE(@uSQL, '@tablekey', vTempKeyName);
    SET @uSQL = REPLACE(@uSQL, '@keyid', vTempKeyID);
    SET @uSQL = REPLACE(@uSQL, '@inUserID', inUserID);

    PREPARE stmt FROM @uSQL;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;

  SET outResult = 1;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP PROCEDURE IF EXISTS ivggs_whs.procWFInit$$
CREATE
PROCEDURE ivggs_whs.procWFInit (IN inWFVersionID int, OUT outResult int)
LBL_EXIT:
BEGIN
  /**
  Return outResult:
  1:成功
  -1：流程版本表ID，有现存的流程数据在使用流程；
  -2：流程版本表ID，设定过代理；
  -3：无FlgNodeType=0的记录；
  -4: 流程定义冲突 2.2 同一时间，同一人+组织+职位+流程类型+[节点类型=0] 必须唯一；否则，返回-4；
  -5：无FlgNodeType=2的记录；
  -100: SQL 执行错误；
  **/
  DECLARE vTmpCount int;
  DECLARE vStepIndex int;

  DECLARE vWFExtID int; /** 游标curWF变量 **/
  DECLARE vWFID int; /** 游标curWF变量 **/
  DECLARE vWFName varchar(256); /** 游标curWF变量 **/
  DECLARE vWFCD varchar(32); /** 游标curWF变量 **/
  DECLARE vWFDWFType smallint; /** 游标curWF变量 **/
  DECLARE vWFStartPositionID int; /** 游标curWF变量 **/
  DECLARE vWFStartOrgCD varchar(64); /** 游标curWF变量 **/
  DECLARE vWFStepID42 int;
  DECLARE vLastWFStepID int;

  DECLARE vWFDtFrom varchar(8);
  DECLARE vWFDtTo varchar(8);

  DECLARE vC2OptIndex int; /** 游标curWFPosition变量 **/
  DECLARE varno_more_record int DEFAULT 0;
  DECLARE curWF CURSOR FOR
  SELECT
    m.WFExtID,
    m.WFID,
    m.Name,
    m.WFCD,
    m.DWFType,
    m.StartPositionID,
    m.StartOrgCD
  FROM mstwfext m
  WHERE m.WFVersionID = inWFVersionID;

  DECLARE curWFPosition CURSOR FOR
  SELECT
    t.OptIndex
  FROM tmpwfposition t
  WHERE t.WFID = vWFID AND t.FlgNodeType = 1
  GROUP BY t.OptIndex
  ORDER BY t.OptIndex;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET varno_more_record = 1;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION SET outResult = - 100;

  /** 执行成功 返回1 **/
  SET outResult = 1;

  SELECT
    mw.DtFrom,
    mw.DtTo INTO vWFDtFrom, vWFDtTo
  FROM mstwfversion mw
  WHERE mw.WFVersionID = inWFVersionID;


  /**1.根据流程版本表ID，查询是否有现存的流程数据在使用流程；如果有，返回-1；**/
  SELECT
    COUNT(b.WFVersionID) INTO vTmpCount
  FROM trnwfdetail a,
       mstwfext b,
       mstwfstep c
  WHERE a.CurrentWFStepID = c.WFStepID AND c.WFExtID = b.WFExtID AND b.WFVersionID = inWFVersionID;
  IF vTmpCount > 0 THEN
    SET outResult = - 1;
    LEAVE LBL_EXIT;
  END IF;

  /**2.根据流程版本表ID，查询是否设定过代理；如果有，返回-2；**/
  SELECT
    COUNT(b.WFVersionID) INTO vTmpCount
  FROM mstproxycontent a,
       mstwfext b,
       mstwfstep c
  WHERE a.WFStepID = c.WFStepID AND c.WFExtID = b.WFExtID AND b.WFVersionID = inWFVersionID;
  IF vTmpCount > 0 THEN
    SET outResult = - 2;
    LEAVE LBL_EXIT;
  END IF;

  /**2.2 同一时间，组织+职位+流程类型+[节点类型=0] 必须唯一；否则，返回-4；**/
  /**
  SELECT
    COUNT(*) INTO vTmpCount
  FROM ((SELECT
            a.DtFrom,
            a.DtTo,
            b.DWFType,
            v.PositionID,
            v.OrgCD
          FROM MstWFVersion a,
               MstWF b,
               TmpWFPosition c,
               TMP_Org u,
               RtnOrgPosition v
          WHERE a.WFVersionID = b.WFVersionID AND b.WFID = c.WFID AND c.FlgNodeType = 0 AND a.WFVersionID = inWFVersionID AND a.DelFlg = '0'
          AND (
          (u.FOrgCD = c.OrgCD AND u.OrgCD = v.OrgCD AND ((u.UsefulFromDt <= a.DtFrom AND u.UsefulToDt >= a.DtFrom) OR (u.UsefulFromDt <= a.DtTo AND u.UsefulToDt >= a.DtTo)))
          OR (u.OrgCD = c.OrgCD AND u.OrgCD = v.OrgCD AND ((u.UsefulFromDt <= a.DtFrom AND u.UsefulToDt >= a.DtFrom) OR (u.UsefulFromDt <= a.DtTo AND u.UsefulToDt >= a.DtTo)))
          ) AND c.PositionID = v.PositionID
          GROUP BY a.DtFrom,
                   a.DtTo,
                   b.DWFType,
                   v.PositionID,
                   v.OrgCD) t1,
        (SELECT
            a.DtFrom,
            a.DtTo,
            b.DWFType,
            v.PositionID,
            v.OrgCD
          FROM MstWFVersion a,
               MstWF b,
               TmpWFPosition c,
               TMP_Org u,
               RtnOrgPosition v
          WHERE a.WFVersionID = b.WFVersionID AND b.WFID = c.WFID AND c.FlgNodeType = 0 AND a.WFVersionID <> inWFVersionID AND a.DelFlg = '0'
          AND (
          (u.FOrgCD = c.OrgCD AND u.OrgCD = v.OrgCD AND ((u.UsefulFromDt <= a.DtFrom AND u.UsefulToDt >= a.DtFrom) OR (u.UsefulFromDt <= a.DtTo AND u.UsefulToDt >= a.DtTo)))
          OR (u.OrgCD = c.OrgCD AND u.OrgCD = v.OrgCD AND ((u.UsefulFromDt <= a.DtFrom AND u.UsefulToDt >= a.DtFrom) OR (u.UsefulFromDt <= a.DtTo AND u.UsefulToDt >= a.DtTo)))
          ) AND c.PositionID = v.PositionID
          GROUP BY a.DtFrom,
                   a.DtTo,
                   b.DWFType,
                   v.PositionID,
                   v.OrgCD) t2
        )
  WHERE t1.DWFType = t2.DWFType AND t1.PositionID = t2.PositionID AND t1.OrgCD = t2.OrgCD
  AND (t1.DtFrom >= t2.DtFrom AND t1.DtFrom <= t2.DtTo
  OR t1.DtTo >= t2.DtFrom AND t1.DtTo <= t2.DtTo);
**/
  SELECT
    COUNT(*) INTO vTmpCount
  FROM mstwf t
  WHERE t.WFVersionID = inWFVersionID;
  IF vTmpCount = 0 THEN /** NEW **/
    SELECT
      COUNT(*) INTO vTmpCount
    FROM (SELECT
             b.DWFType,
             v.PositionID,
             v.OrgCD,
             a.DtFrom,
             a.DtTo
           FROM mstwfversion a,
                mstwf b,
                tmpwfposition c,
                tmp_org u,
                rtnorgposition v
           WHERE a.WFVersionID = b.WFVersionID AND b.WFID = c.WFID AND c.FlgNodeType = 0 AND a.WFVersionID = inWFVersionID AND a.DelFlg = '0'
           AND (
           (u.FOrgCD = c.OrgCD AND u.OrgCD = v.OrgCD AND ((u.UsefulFromDt <= a.DtFrom AND u.UsefulToDt >= a.DtFrom) OR (u.UsefulFromDt <= a.DtTo AND u.UsefulToDt >= a.DtTo)))
           OR (u.OrgCD = c.OrgCD AND u.OrgCD = v.OrgCD AND ((u.UsefulFromDt <= a.DtFrom AND u.UsefulToDt >= a.DtFrom) OR (u.UsefulFromDt <= a.DtTo AND u.UsefulToDt >= a.DtTo)))
           ) AND c.PositionID = v.PositionID
           GROUP BY b.DWFType,
                    v.PositionID,
                    v.OrgCD,
                    a.DtFrom,
                    a.DtTo) t,
         mstwfext m,
         mstwfversion n
    WHERE t.DWFType = m.DWFType AND t.PositionID = m.StartPositionID AND t.OrgCD = m.StartOrgCD
    AND m.WFVersionID = n.WFVersionID AND ((n.DtFrom >= t.DtFrom AND n.DtFrom <= t.DtTo) OR (n.DtTo >= t.DtFrom AND n.DtTo <= t.DtTo));
  ELSE
    /** Update **/
    SELECT
      COUNT(*) INTO vTmpCount
    FROM (SELECT
             b.DWFType,
             v.PositionID,
             v.OrgCD,
             a.DtFrom,
             a.DtTo
           FROM mstwfversion a,
                mstwf b,
                tmpwfposition c,
                tmp_org u,
                rtnorgposition v
           WHERE a.WFVersionID = b.WFVersionID AND b.WFID = c.WFID AND c.FlgNodeType = 0 AND a.WFVersionID = inWFVersionID AND a.DelFlg = '0'
           AND (
           (u.FOrgCD = c.OrgCD AND u.OrgCD = v.OrgCD AND ((u.UsefulFromDt <= a.DtFrom AND u.UsefulToDt >= a.DtFrom) OR (u.UsefulFromDt <= a.DtTo AND u.UsefulToDt >= a.DtTo)))
           OR (u.OrgCD = c.OrgCD AND u.OrgCD = v.OrgCD AND ((u.UsefulFromDt <= a.DtFrom AND u.UsefulToDt >= a.DtFrom) OR (u.UsefulFromDt <= a.DtTo AND u.UsefulToDt >= a.DtTo)))
           ) AND c.PositionID = v.PositionID
           GROUP BY b.DWFType,
                    v.PositionID,
                    v.OrgCD,
                    a.DtFrom,
                    a.DtTo) t,
         mstwfext m,
         mstwfversion n
    WHERE t.DWFType = m.DWFType AND t.PositionID = m.StartPositionID AND t.OrgCD = m.StartOrgCD AND m.WFVersionID != inWFVersionID
    AND m.WFVersionID = n.WFVersionID AND ((n.DtFrom >= t.DtFrom AND n.DtFrom <= t.DtTo) OR (n.DtTo >= t.DtFrom AND n.DtTo <= t.DtTo));
  END IF;

  IF vTmpCount > 0 THEN
    SET outResult = - 4;
    LEAVE LBL_EXIT;
  END IF;

  /**3.根据流程版本表ID，删除相关流程步骤表、流程参与职位表、流程基本扩展表相关信息；**/
  DELETE
    FROM mstwfstep
  WHERE WFExtID IN (SELECT
        m.WFExtID
      FROM mstwfext m
      WHERE m.WFVersionID = inWFVersionID
      GROUP BY m.WFExtID);

  DELETE
    FROM rtnwfposition
  WHERE WFExtID IN (SELECT
        m.WFExtID
      FROM mstwfext m
      WHERE m.WFVersionID = inWFVersionID
      GROUP BY m.WFExtID);

  DELETE
    FROM mstwfext
  WHERE WFVersionID = inWFVersionID;


  INSERT INTO mstwfext (WFVersionID, WFID, DWFType, Name, WFCD, TableName, KeyName, FlgMS, StartPositionID, StartOrgCD)
    SELECT
      a.WFVersionID,
      b.WFID,
      b.DWFType,
      b.Name,
      b.WFCD,
      CASE
          WHEN b.DWFType = 1 THEN 'TrnWHForm'
          WHEN b.DWFType = 2 THEN 'TrnOVForm' ELSE 'TrnVCForm'
        END AS TableName,
      CASE
          WHEN b.DWFType = 1 THEN 'WHFormID'
          WHEN b.DWFType = 2 THEN 'OVFormID' ELSE 'VCFormID'
        END AS KeyName,
      /**b.TableName, **/
      /**b.KeyName,**/
      b.FlgMS,
      v.PositionID,
      v.OrgCD
    FROM mstwfversion a,
         mstwf b,
         tmpwfposition c,
         tmp_org u,
         rtnorgposition v
    WHERE a.WFVersionID = b.WFVersionID AND b.WFID = c.WFID AND c.FlgNodeType = 0 AND a.WFVersionID = inWFVersionID AND a.DelFlg = '0'
    AND (
    (u.FOrgCD = c.OrgCD AND u.OrgCD = v.OrgCD AND ((u.UsefulFromDt <= a.DtFrom AND u.UsefulToDt >= a.DtFrom) OR (u.UsefulFromDt <= a.DtTo AND u.UsefulToDt >= a.DtTo)))
    OR (u.OrgCD = c.OrgCD AND u.OrgCD = v.OrgCD AND ((u.UsefulFromDt <= a.DtFrom AND u.UsefulToDt >= a.DtFrom) OR (u.UsefulFromDt <= a.DtTo AND u.UsefulToDt >= a.DtTo)))
    ) AND c.PositionID = v.PositionID
    GROUP BY a.WFVersionID,
             b.WFID,
             b.DWFType,
             b.Name,
             b.WFCD,
             b.TableName,
             b.KeyName,
             b.FlgMS,
             v.PositionID,
             v.OrgCD;

  /**4.选择流程基本表相关记录 Where 流程基本表.流程版本表ID=传入版本ID，对每一条记录进行如下操作：**/
  OPEN curWF;

LBL_LP1:
LOOP
  FETCH curWF INTO vWFExtID, vWFID, vWFName, vWFCD, vWFDWFType, vWFStartPositionID, vWFStartOrgCD;
  IF varno_more_record = 1 THEN
    LEAVE LBL_LP1;
  END IF;

  SET vStepIndex = 1;
  /**  4.1 Select * from 流程参与职位临时表 where 流程参与职位表.流程基本表ID = Iterator.流程基本表ID and 流程参与职位临时表.F节点类型=0 **/
  /**  4.2 Insert Into 流程步骤表	
	流程步骤表ID = 自动增长
	流程基本表ID = Iterator.流程基本表ID
	驳回流程步骤ID = 0
	前驱流程步骤ID = 0
	后继流程步骤ID = 0
	步骤名称 = "创建"+Iterator.流程名称
	步骤序号 = StepIndex++
	F审批类型 = 任一通过 1
	F拒绝类型 = 任一拒绝 1
	F创建步骤标志 = 1
	F审批步骤标志 = 2
	F完结步骤标志 = 2
**/
  SELECT
    COUNT(t.WFPositionID) INTO vTmpCount
  FROM tmpwfposition t
  WHERE t.WFID = vWFID AND t.FlgNodeType = 0;
  IF vTmpCount = 0 THEN
    SET outResult = - 3;
    LEAVE LBL_EXIT;
  END IF;

  INSERT INTO mstwfstep (WFExtID, RejectStepID, PrevStepID, NextStepID, StepName, StepNo, FlgApprove, FlgReject, FlgCreateStep, FlgApproveStep, FlgEndStep)
    VALUE (vWFExtID, 0, 0, 0, CONCAT('创建', vWFName), vStepIndex, 1, 1, 1, 2, 2);
  SELECT
    LAST_INSERT_ID() INTO vWFStepID42;

  /** vStepIndex++ **/
  SELECT
    MAX(a.StepNo) + 1 INTO vStepIndex
  FROM mstwfstep a
  WHERE a.WFExtID = vWFExtID;

  /**  4.3 Insert Into 流程参与职位表	
	流程参与职位表ID = 自动增长
	流程步骤表ID = 4.2.流程步骤表ID
	职位表ID = 4.1.职位表ID
	组织编码 = 4.1.组织编码 **/
  INSERT INTO rtnwfposition (WFExtID, WFStepID, PositionID, OrgCD)
    VALUE (vWFExtID, vWFStepID42, vWFStartPositionID, vWFStartOrgCD);

  /**      Vlast流程步骤ID = 4.2.流程步骤表ID **/
  SET vLastWFStepID = vWFStepID42;

  /**  4.4 Select * from 流程参与职位临时表 where 流程参与职位表.流程基本表ID = Iterator.流程基本表ID and 流程参与职位临时表.F节点类型=1 ORDERBY 流程参与职位临时表.序号
      针对每一条记录进行操作：
    **/
  OPEN curWFPosition;
LBL_LP02:
LOOP
  FETCH curWFPosition INTO vC2OptIndex;
  IF varno_more_record = 1 THEN
    LEAVE LBL_LP02;
  END IF;

  /**用于排除在组织树中没有的职位，（人事担当）**/
  SELECT
    COUNT(*) INTO vTmpCount
  FROM (SELECT
      t.PositionID
    FROM tmpwfposition t,
         tmp_org u,
         rtnorgposition v
    WHERE t.WFID = vWFID AND t.FlgNodeType = 1 AND t.OptIndex = vC2OptIndex
    AND (
    (u.OrgCD = vWFStartOrgCD AND u.OrgCD = v.OrgCD AND ((u.UsefulFromDt <= vWFDtFrom AND u.UsefulToDt >= vWFDtFrom) OR (u.UsefulFromDt <= vWFDtTo AND u.UsefulToDt >= vWFDtTo)))
    OR (u.OrgCD = vWFStartOrgCD AND u.FOrgCD = v.OrgCD AND ((u.UsefulFromDt <= vWFDtFrom AND u.UsefulToDt >= vWFDtFrom) OR (u.UsefulFromDt <= vWFDtTo AND u.UsefulToDt >= vWFDtTo)))
    ) AND t.PositionID = v.PositionID
    GROUP BY t.PositionID) a;
  IF vTmpCount = 0 THEN
    ITERATE LBL_LP02;
  END IF;

  /**
     4.4.1 Insert Into 流程步骤表	
	流程步骤表ID = 自动增长
	流程基本表ID = Iterator.流程基本表ID
	驳回流程步骤ID = Vlast流程步骤ID
	前驱流程步骤ID = Vlast流程步骤ID
	后继流程步骤ID = 0
	步骤名称 = "审批"+Iterator.流程名称+Iterator2.序号
	步骤序号 = StepIndex++
	F审批类型 = 任一通过 1
	F拒绝类型 = 任一拒绝 1
	F创建步骤标志 = 2
	F审批步骤标志 = 1
	F完结步骤标志 = 2
**/
  INSERT INTO mstwfstep (WFExtID, RejectStepID, PrevStepID, NextStepID, StepName, StepNo, FlgApprove, FlgReject, FlgCreateStep, FlgApproveStep, FlgEndStep)
    VALUE (vWFExtID, vLastWFStepID, vLastWFStepID, 0, CONCAT('审批', vWFName, ' - ', vC2OptIndex), vStepIndex, 1, 1, 2, 1, 2);
  SELECT
    LAST_INSERT_ID() INTO vWFStepID42;

  /** vStepIndex++ **/
  SELECT
    MAX(a.StepNo) + 1 INTO vStepIndex
  FROM mstwfstep a
  WHERE a.WFExtID = vWFExtID;

  /**4.4.2 Update 流程步骤表 set 后继流程步骤ID = 4.4.1.流程步骤表ID WHERE 流程步骤表ID = Vlast流程步骤ID **/
  UPDATE mstwfstep m
  SET m.NextStepID = vWFStepID42
  WHERE m.WFStepID = vLastWFStepID;

  /** 4.4.3 Insert Into 流程参与职位表	
	流程参与职位表ID = 自动增长
	流程步骤表ID = 4.4.1流程步骤表ID
	职位表ID = Iterator2.职位表ID
	组织编码 = Iterator2.组织编码
**/
  INSERT INTO rtnwfposition (WFExtID, WFStepID, PositionID, OrgCD)
    SELECT
      vWFExtID AS WFExtID,
      vWFStepID42 AS WFStepID,
      t.PositionID,
      v.OrgCD
    FROM tmpwfposition t,
         tmp_org u,
         rtnorgposition v
    WHERE t.WFID = vWFID AND t.FlgNodeType = 1 AND t.OptIndex = vC2OptIndex
    AND (
    (u.OrgCD = vWFStartOrgCD AND u.OrgCD = v.OrgCD AND ((u.UsefulFromDt <= vWFDtFrom AND u.UsefulToDt >= vWFDtFrom) OR (u.UsefulFromDt <= vWFDtTo AND u.UsefulToDt >= vWFDtTo)))
    OR (u.OrgCD = vWFStartOrgCD AND u.FOrgCD = v.OrgCD AND ((u.UsefulFromDt <= vWFDtFrom AND u.UsefulToDt >= vWFDtFrom) OR (u.UsefulFromDt <= vWFDtTo AND u.UsefulToDt >= vWFDtTo)))
    ) AND t.PositionID = v.PositionID
    GROUP BY t.PositionID,
             v.OrgCD;

  /**      Vlast流程步骤ID = 4.4.1.流程步骤表ID **/
  SET vLastWFStepID = vWFStepID42;
END LOOP LBL_LP02;
  CLOSE curWFPosition;
  SET varno_more_record = 0;

  /**  4.5 Select * from 流程参与职位临时表 where 流程参与职位表.流程基本表ID = Iterator.流程基本表ID and 流程参与职位临时表.F节点类型=2 **/
  /**  4.6 Insert Into 流程步骤表	
	流程步骤表ID = 自动增长
	流程基本表ID = Iterator.流程基本表ID
	驳回流程步骤ID = Vlast流程步骤ID
	前驱流程步骤ID = Vlast流程步骤ID
	后继流程步骤ID = 0
	步骤名称 = "完结"+Iterator.流程名称
	步骤序号 = StepIndex++
	F审批类型 = 任一通过 1
	F拒绝类型 = 任一拒绝 1
	F创建步骤标志 = 2
	F审批步骤标志 = 1
	F完结步骤标志 = 1
**/
  SELECT
    COUNT(t.WFPositionID) INTO vTmpCount
  FROM tmpwfposition t
  WHERE t.WFID = vWFID AND t.FlgNodeType = 2;
  IF vTmpCount = 0 THEN
    SET outResult = - 5;
    LEAVE LBL_EXIT;
  END IF;
  INSERT INTO mstwfstep (WFExtID, RejectStepID, PrevStepID, NextStepID, StepName, StepNo, FlgApprove, FlgReject, FlgCreateStep, FlgApproveStep, FlgEndStep)
    VALUE (vWFExtID, vLastWFStepID, vLastWFStepID, 0, CONCAT('完结', vWFName), vStepIndex, 1, 1, 2, 1, 1);
  SELECT
    LAST_INSERT_ID() INTO vWFStepID42;

  /**  4.7 Update 流程步骤表 set 后继流程步骤ID = 4.6.流程步骤表ID WHERE 流程步骤表ID = Vlast流程步骤ID **/
  UPDATE mstwfstep m
  SET m.NextStepID = vWFStepID42
  WHERE m.WFStepID = vLastWFStepID;

  /**     4.8 Insert Into 流程参与职位表	
	流程参与职位表ID = 自动增长
	流程步骤表ID = 4.6.流程步骤表ID
	职位表ID = 4.5.职位表ID
	组织编码 = 4.5.组织编码
**/
  INSERT INTO rtnwfposition (WFExtID, WFStepID, PositionID, OrgCD)
    SELECT
      vWFExtID AS WFExtID,
      vWFStepID42 AS WFStepID,
      t.PositionID,
      v.OrgCD
    FROM tmpwfposition t,
         tmp_org u,
         rtnorgposition v
    WHERE t.WFID = vWFID AND t.FlgNodeType = 2
    AND (
    (u.OrgCD = vWFStartOrgCD AND u.OrgCD = v.OrgCD AND ((u.UsefulFromDt <= vWFDtFrom AND u.UsefulToDt >= vWFDtFrom) OR (u.UsefulFromDt <= vWFDtTo AND u.UsefulToDt >= vWFDtTo)))
    OR (u.OrgCD = vWFStartOrgCD AND u.FOrgCD = v.OrgCD AND ((u.UsefulFromDt <= vWFDtFrom AND u.UsefulToDt >= vWFDtFrom) OR (u.UsefulFromDt <= vWFDtTo AND u.UsefulToDt >= vWFDtTo)))
    ) AND t.PositionID = v.PositionID
    GROUP BY t.PositionID,
             v.OrgCD;
END LOOP LBL_LP1;
  CLOSE curWF;

END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP PROCEDURE IF EXISTS ivggs_whs.procWFQueryOV$$
CREATE
PROCEDURE ivggs_whs.procWFQueryOV (IN inUserID int, IN insSchString varchar(2048), OUT outResult int)
BEGIN
  DECLARE vObjYM char(6);
  DECLARE vEmployeeIDs varchar(1024);
  DECLARE vStatus int;

  DECLARE vValidateID varchar(2048);
  DECLARE vTempIndex int;
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET outResult = - 100;
  SET outResult = 1;
  /**条件语句 = ‘员工ID的List(O)；对象年月(M)；状态(M)’ **/
  SET vEmployeeIDs = fnGetStrArrayAtIndex(insSchString, ';', 1, FALSE);
  SET vObjYM = fnGetStrArrayAtIndex(insSchString, ';', 2, FALSE);
  SET vStatus = fnGetStrArrayAtIndex(insSchString, ';', 3, FALSE);

  SET @uSQL1 = 'SELECT GROUP_CONCAT(t.WFDetailID SEPARATOR \',\') into @uResult1 FROM (
  SELECT CONVERT(e.WFDetailID, char) AS WFDetailID
  FROM VW_ConfirmWFInfo a,
     RtnEmployeeOrg b,
     MstPosition c,
     TrnWFStepBasic d,
     TrnWFDetail e
  WHERE a.PositionID = b.PositionID AND a.OrgCD = b.OrgCD AND b.PositionID = c.PositionID
  AND d.WFStepBasicID = e.WFStepBasicID AND e.CurrentWFStepID = a.WFStepID AND a.TableName = d.AppTableName AND a.KeyName = d.AppKeyName
  @DtWFStatus AND d.DWFType = 2 AND d.FlgNew = 1
  AND a.DWFType = d.DWFType AND a.FlgApproveStep = 1
  AND b.EmployeeID = @inUserID
  AND @vObjYM >= SUBSTR(a.DtFrom, 1, 6) AND @vObjYM <= SUBSTR(a.DtTo, 1, 6)
  AND @vObjYM >= SUBSTR(b.UsefulFromDt, 1, 6) AND @vObjYM <= SUBSTR(b.UsefulToDt, 1, 6)
  AND c.FlgCanApprove = 1 @AppEmIDs
  GROUP BY e.WFDetailID ) t ';

  IF LENGTH(TRIM(vEmployeeIDs)) > 0 THEN
    SET @uSQL1 = REPLACE(@uSQL1, '@AppEmIDs', REPLACE('AND d.AppEmID IN (@employeeIDs)', '@employeeIDs', vEmployeeIDs));
  ELSE
    SET @uSQL1 = REPLACE(@uSQL1, '@AppEmIDs', '');
  END IF;
  SET @uSQL1 = REPLACE(@uSQL1, '@vObjYM', vObjYM);
  SET @uSQL1 = REPLACE(@uSQL1, '@inUserID', inUserID);
  IF vStatus = 1 THEN
    SET @uSQL1 = REPLACE(@uSQL1, '@DtWFStatus', 'AND e.DtWFStatus IN (1, 3,11,12)');
  ELSE
    SET @uSQL1 = REPLACE(@uSQL1, '@DtWFStatus', 'AND e.DtWFStatus IN (2, 10)');
  END IF;


  PREPARE stmt1 FROM @uSQL1;
  EXECUTE stmt1;
  DEALLOCATE PREPARE stmt1;

  IF @uResult1 IS NULL THEN
    SET @uResult1 = '';
  END IF;


  SET @uSQL1 = 'SELECT GROUP_CONCAT(t.WFDetailID SEPARATOR \',\') into @uResult2 FROM (
  SELECT CONVERT(e.WFDetailID, char) AS WFDetailID
  FROM VW_ConfirmWFInfo a,
     RtnEmployeeOrg b,
     MstPosition c,
     TrnWFStepBasic d,
     TrnWFDetail e,
     VW_ProxyInfo f
  WHERE a.PositionID = b.PositionID AND a.OrgCD = b.OrgCD AND b.PositionID = c.PositionID
  AND d.WFStepBasicID = e.WFStepBasicID AND e.CurrentWFStepID = a.WFStepID AND a.TableName = d.AppTableName AND a.KeyName = d.AppKeyName
  AND d.DWFType = 2 @DtWFStatus AND d.FlgNew = 1
  AND a.DWFType = d.DWFType AND a.FlgApproveStep = 1
  AND @vObjYM >= SUBSTR(a.DtFrom, 1, 6) AND @vObjYM <= SUBSTR(a.DtTo, 1, 6)
  AND @vObjYM >= SUBSTR(b.UsefulFromDt, 1, 6) AND @vObjYM <= SUBSTR(b.UsefulToDt, 1, 6) 
  @AppEmIDs
  AND f.WFStepID = a.WFStepID 
  AND @vObjYM >= SUBSTR(f.FromDt, 1, 6) AND @vObjYM <= SUBSTR(f.ToDt, 1, 6)
  AND f.AgentID = @inUserID AND f.EmployeeID = d.AppEmID AND b.EmployeeID = f.ClientID
  GROUP BY e.WFDetailID ) t ';
  IF LENGTH(TRIM(vEmployeeIDs)) > 0 THEN
    SET @uSQL1 = REPLACE(@uSQL1, '@AppEmIDs', REPLACE('AND d.AppEmID IN (@employeeIDs)', '@employeeIDs', vEmployeeIDs));
  ELSE
    SET @uSQL1 = REPLACE(@uSQL1, '@AppEmIDs', '');
  END IF;
  SET @uSQL1 = REPLACE(@uSQL1, '@vObjYM', vObjYM);
  SET @uSQL1 = REPLACE(@uSQL1, '@inUserID', inUserID);
  IF vStatus = 1 THEN
    SET @uSQL1 = REPLACE(@uSQL1, '@DtWFStatus', 'AND e.DtWFStatus IN (1, 3,11,12)');
  ELSE
    SET @uSQL1 = REPLACE(@uSQL1, '@DtWFStatus', 'AND e.DtWFStatus IN (2, 10)');
  END IF;

  PREPARE stmt1 FROM @uSQL1;
  EXECUTE stmt1;
  DEALLOCATE PREPARE stmt1;

  IF @uResult2 IS NULL THEN
    SET @uResult2 = '';
  END IF;

  IF LENGTH(@uResult1) > 0 THEN
    SET @uSQL1 = 'SELECT GROUP_CONCAT(t.WFDetailID SEPARATOR \',\') into @uResult3 FROM (
  SELECT CONVERT(e.WFDetailID, char) AS WFDetailID
  FROM VW_ConfirmWFInfo a,
     RtnEmployeeOrg b,
     MstPosition c,
     TrnWFStepBasic d,
     TrnWFDetail e,
     VW_ProxyInfo f
  WHERE a.PositionID = b.PositionID AND a.OrgCD = b.OrgCD AND b.PositionID = c.PositionID
  AND d.WFStepBasicID = e.WFStepBasicID AND e.CurrentWFStepID = a.WFStepID AND a.TableName = d.AppTableName AND a.KeyName = d.AppKeyName
  AND d.DWFType = 2 @DtWFStatus AND d.FlgNew = 1
  AND a.DWFType = d.DWFType AND a.FlgApproveStep = 1
  AND @vObjYM >= SUBSTR(a.DtFrom, 1, 6) AND @vObjYM <= SUBSTR(a.DtTo, 1, 6)
  AND @vObjYM >= SUBSTR(b.UsefulFromDt, 1, 6) AND @vObjYM <= SUBSTR(b.UsefulToDt, 1, 6) 
  @AppEmIDs
  AND f.WFStepID = a.WFStepID 
  AND @vObjYM >= SUBSTR(f.FromDt, 1, 6) AND @vObjYM <= SUBSTR(f.ToDt, 1, 6)
  AND f.ClientID = @inUserID AND f.FlgShare = 2 AND b.EmployeeID = f.ClientID AND f.EmployeeID = d.AppEmID
  GROUP BY e.WFDetailID ) t ';
    IF LENGTH(TRIM(vEmployeeIDs)) > 0 THEN
      SET @uSQL1 = REPLACE(@uSQL1, '@AppEmIDs', REPLACE('AND d.AppEmID IN (@employeeIDs)', '@employeeIDs', vEmployeeIDs));
    ELSE
      SET @uSQL1 = REPLACE(@uSQL1, '@AppEmIDs', '');
    END IF;
    SET @uSQL1 = REPLACE(@uSQL1, '@vObjYM', vObjYM);
    SET @uSQL1 = REPLACE(@uSQL1, '@inUserID', inUserID);
    IF vStatus = 1 THEN
      SET @uSQL1 = REPLACE(@uSQL1, '@DtWFStatus', 'AND e.DtWFStatus IN (1, 3,11,12)');
    ELSE
      SET @uSQL1 = REPLACE(@uSQL1, '@DtWFStatus', 'AND e.DtWFStatus IN (2, 10)');
    END IF;

    PREPARE stmt1 FROM @uSQL1;
    EXECUTE stmt1;
    DEALLOCATE PREPARE stmt1;

    IF @uResult3 IS NULL THEN
      SET @uResult3 = '';
    END IF;

    IF LENGTH(@uResult3) > 0 THEN
      SET @uResult1 = ivggs_whs.fnReplaceStrArray(@uResult1, @uResult3, ',', '');
    END IF;
  END IF;


  SET vValidateID = CONCAT(@uResult1, ',', @uResult2, ',');
  IF LENGTH(TRIM(vEmployeeIDs)) > 0 THEN
    SET vEmployeeIDs = CONCAT(vEmployeeIDs, ',');

    SELECT
      a.WFStepBasicID,
      a.AppKey,
      a.AppEmID,
      b.DtWFStatus,
      b.OptID,
      b.OptPositionID,
      b.OptOrgCD
    FROM TrnWFStepBasic a,
         TrnWFDetail b,
         TrnOVForm c
    WHERE a.WFStepBasicID = b.WFStepBasicID AND a.DWFType = 2 AND a.FlgNew = 1
    AND LOCATE(CONCAT(',', b.WFDetailID, ','), CONCAT(',', vValidateID)) > 0
    AND UPPER(a.AppTableName) = 'TRNOVFORM' AND UPPER(a.AppKeyName) = 'OVFORMID'
    AND a.AppKey = c.OVFormID AND a.AppEmID = c.EmployeeID
    AND LOCATE(CONCAT(',', c.EmployeeID, ','), CONCAT(',', vEmployeeIDs)) > 0
    GROUP BY a.WFStepBasicID,
             a.AppKey,
             a.AppEmID,
             b.DtWFStatus,
             b.OptID,
             b.OptPositionID,
             b.OptOrgCD;
  ELSE
    SELECT
      a.WFStepBasicID,
      a.AppKey,
      a.AppEmID,
      b.DtWFStatus,
      b.OptID,
      b.OptPositionID,
      b.OptOrgCD
    FROM TrnWFStepBasic a,
         TrnWFDetail b,
         TrnOVForm c
    WHERE a.WFStepBasicID = b.WFStepBasicID AND a.DWFType = 2 AND a.FlgNew = 1
    AND LOCATE(CONCAT(',', b.WFDetailID, ','), CONCAT(',', vValidateID)) > 0
    AND UPPER(a.AppTableName) = 'TRNOVFORM' AND UPPER(a.AppKeyName) = 'OVFORMID'
    AND a.AppKey = c.OVFormID AND a.AppEmID = c.EmployeeID
    GROUP BY a.WFStepBasicID,
             a.AppKey,
             a.AppEmID,
             b.DtWFStatus,
             b.OptID,
             b.OptPositionID,
             b.OptOrgCD
    ;
  END IF;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP PROCEDURE IF EXISTS ivggs_whs.procWFQueryVC$$
CREATE
PROCEDURE ivggs_whs.procWFQueryVC (IN inUserID int, IN insSchString varchar(2048), OUT outResult int)
BEGIN
  DECLARE vObjYM char(6);
  DECLARE vEmployeeIDs varchar(1024);
  DECLARE vStatus int;

  DECLARE vValidateID varchar(2048);
  DECLARE vTempIndex int;
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET outResult = - 100;
  SET outResult = 1;
  /**条件语句 = ‘员工ID的List(O)；对象年月(M)；状态(M)’ **/
  SET vEmployeeIDs = fnGetStrArrayAtIndex(insSchString, ';', 1, FALSE);
  SET vObjYM = fnGetStrArrayAtIndex(insSchString, ';', 2, FALSE);
  SET vStatus = fnGetStrArrayAtIndex(insSchString, ';', 3, FALSE);

  SET @uSQL1 = 'SELECT GROUP_CONCAT(t.WFDetailID SEPARATOR \',\') into @uResult1 FROM (
  SELECT CONVERT(e.WFDetailID, char) AS WFDetailID
  FROM VW_ConfirmWFInfo a,
     RtnEmployeeOrg b,
     MstPosition c,
     TrnWFStepBasic d,
     TrnWFDetail e
  WHERE a.PositionID = b.PositionID AND a.OrgCD = b.OrgCD AND b.PositionID = c.PositionID
  AND d.WFStepBasicID = e.WFStepBasicID AND e.CurrentWFStepID = a.WFStepID AND a.TableName = d.AppTableName AND a.KeyName = d.AppKeyName
  @DtWFStatus AND d.DWFType = 3  AND d.FlgNew = 1
  AND a.DWFType = d.DWFType AND a.FlgApproveStep = 1
  AND b.EmployeeID = @inUserID
  AND @vObjYM >= SUBSTR(a.DtFrom, 1, 6) AND @vObjYM <= SUBSTR(a.DtTo, 1, 6)
  AND @vObjYM >= SUBSTR(b.UsefulFromDt, 1, 6) AND @vObjYM <= SUBSTR(b.UsefulToDt, 1, 6)
  AND c.FlgCanApprove = 1 @AppEmIDs
  GROUP BY e.WFDetailID ) t ';

  IF LENGTH(TRIM(vEmployeeIDs)) > 0 THEN
    SET @uSQL1 = REPLACE(@uSQL1, '@AppEmIDs', REPLACE('AND d.AppEmID IN (@employeeIDs)', '@employeeIDs', vEmployeeIDs));
  ELSE
    SET @uSQL1 = REPLACE(@uSQL1, '@AppEmIDs', '');
  END IF;
  SET @uSQL1 = REPLACE(@uSQL1, '@vObjYM', vObjYM);
  SET @uSQL1 = REPLACE(@uSQL1, '@inUserID', inUserID);
  IF vStatus = 1 THEN
    SET @uSQL1 = REPLACE(@uSQL1, '@DtWFStatus', 'AND e.DtWFStatus IN (1, 3,11,12)');
  ELSE
    SET @uSQL1 = REPLACE(@uSQL1, '@DtWFStatus', 'AND e.DtWFStatus IN (2, 10)');
  END IF;


  PREPARE stmt1 FROM @uSQL1;
  EXECUTE stmt1;
  DEALLOCATE PREPARE stmt1;

  IF @uResult1 IS NULL THEN
    SET @uResult1 = '';
  END IF;


  SET @uSQL1 = 'SELECT GROUP_CONCAT(t.WFDetailID SEPARATOR \',\') into @uResult2 FROM (
  SELECT CONVERT(e.WFDetailID, char) AS WFDetailID
  FROM VW_ConfirmWFInfo a,
     RtnEmployeeOrg b,
     MstPosition c,
     TrnWFStepBasic d,
     TrnWFDetail e,
     VW_ProxyInfo f
  WHERE a.PositionID = b.PositionID AND a.OrgCD = b.OrgCD AND b.PositionID = c.PositionID
  AND d.WFStepBasicID = e.WFStepBasicID AND e.CurrentWFStepID = a.WFStepID AND a.TableName = d.AppTableName AND a.KeyName = d.AppKeyName
  AND d.DWFType = 3 @DtWFStatus  AND d.FlgNew = 1
  AND a.DWFType = d.DWFType AND a.FlgApproveStep = 1
  AND @vObjYM >= SUBSTR(a.DtFrom, 1, 6) AND @vObjYM <= SUBSTR(a.DtTo, 1, 6)
  AND @vObjYM >= SUBSTR(b.UsefulFromDt, 1, 6) AND @vObjYM <= SUBSTR(b.UsefulToDt, 1, 6) 
  @AppEmIDs
  AND f.WFStepID = a.WFStepID 
  AND @vObjYM >= SUBSTR(f.FromDt, 1, 6) AND @vObjYM <= SUBSTR(f.ToDt, 1, 6)
  AND f.AgentID = @inUserID AND f.EmployeeID = d.AppEmID AND b.EmployeeID = f.ClientID
  GROUP BY e.WFDetailID ) t ';
  IF LENGTH(TRIM(vEmployeeIDs)) > 0 THEN
    SET @uSQL1 = REPLACE(@uSQL1, '@AppEmIDs', REPLACE('AND d.AppEmID IN (@employeeIDs)', '@employeeIDs', vEmployeeIDs));
  ELSE
    SET @uSQL1 = REPLACE(@uSQL1, '@AppEmIDs', '');
  END IF;
  SET @uSQL1 = REPLACE(@uSQL1, '@vObjYM', vObjYM);
  SET @uSQL1 = REPLACE(@uSQL1, '@inUserID', inUserID);
  IF vStatus = 1 THEN
    SET @uSQL1 = REPLACE(@uSQL1, '@DtWFStatus', 'AND e.DtWFStatus IN (1, 3,11,12)');
  ELSE
    SET @uSQL1 = REPLACE(@uSQL1, '@DtWFStatus', 'AND e.DtWFStatus IN (2, 10)');
  END IF;

  PREPARE stmt1 FROM @uSQL1;
  EXECUTE stmt1;
  DEALLOCATE PREPARE stmt1;

  IF @uResult2 IS NULL THEN
    SET @uResult2 = '';
  END IF;

  IF LENGTH(@uResult1) > 0 THEN
    SET @uSQL1 = 'SELECT GROUP_CONCAT(t.WFDetailID SEPARATOR \',\') into @uResult3 FROM (
  SELECT CONVERT(e.WFDetailID, char) AS WFDetailID
  FROM VW_ConfirmWFInfo a,
     RtnEmployeeOrg b,
     MstPosition c,
     TrnWFStepBasic d,
     TrnWFDetail e,
     VW_ProxyInfo f
  WHERE a.PositionID = b.PositionID AND a.OrgCD = b.OrgCD AND b.PositionID = c.PositionID
  AND d.WFStepBasicID = e.WFStepBasicID AND e.CurrentWFStepID = a.WFStepID AND a.TableName = d.AppTableName AND a.KeyName = d.AppKeyName
  AND d.DWFType = 3 @DtWFStatus  AND d.FlgNew = 1
  AND a.DWFType = d.DWFType AND a.FlgApproveStep = 1
  AND @vObjYM >= SUBSTR(a.DtFrom, 1, 6) AND @vObjYM <= SUBSTR(a.DtTo, 1, 6)
  AND @vObjYM >= SUBSTR(b.UsefulFromDt, 1, 6) AND @vObjYM <= SUBSTR(b.UsefulToDt, 1, 6) 
  @AppEmIDs
  AND f.WFStepID = a.WFStepID 
  AND @vObjYM >= SUBSTR(f.FromDt, 1, 6) AND @vObjYM <= SUBSTR(f.ToDt, 1, 6)
  AND f.ClientID = @inUserID AND f.FlgShare = 2 AND b.EmployeeID = f.ClientID AND f.EmployeeID = d.AppEmID
  GROUP BY e.WFDetailID ) t ';
    IF LENGTH(TRIM(vEmployeeIDs)) > 0 THEN
      SET @uSQL1 = REPLACE(@uSQL1, '@AppEmIDs', REPLACE('AND d.AppEmID IN (@employeeIDs)', '@employeeIDs', vEmployeeIDs));
    ELSE
      SET @uSQL1 = REPLACE(@uSQL1, '@AppEmIDs', '');
    END IF;
    SET @uSQL1 = REPLACE(@uSQL1, '@vObjYM', vObjYM);
    SET @uSQL1 = REPLACE(@uSQL1, '@inUserID', inUserID);
    IF vStatus = 1 THEN
      SET @uSQL1 = REPLACE(@uSQL1, '@DtWFStatus', 'AND e.DtWFStatus IN (1, 3,11,12)');
    ELSE
      SET @uSQL1 = REPLACE(@uSQL1, '@DtWFStatus', 'AND e.DtWFStatus IN (2, 10)');
    END IF;

    PREPARE stmt1 FROM @uSQL1;
    EXECUTE stmt1;
    DEALLOCATE PREPARE stmt1;

    IF @uResult3 IS NULL THEN
      SET @uResult3 = '';
    END IF;

    IF LENGTH(@uResult3) > 0 THEN
      SET @uResult1 = ivggs_whs.fnReplaceStrArray(@uResult1, @uResult3, ',', '');
    END IF;
  END IF;


  SET vValidateID = CONCAT(@uResult1, ',', @uResult2, ',');

  IF LENGTH(TRIM(vEmployeeIDs)) > 0 THEN
    SET vEmployeeIDs = CONCAT(vEmployeeIDs, ',');

    SELECT
      a.WFStepBasicID,
      a.AppKey,
      a.AppEmID,
      b.DtWFStatus
    FROM TrnWFStepBasic a,
         TrnWFDetail b,
         TrnVCForm c
    WHERE a.WFStepBasicID = b.WFStepBasicID AND a.DWFType = 3 AND a.FlgNew = 1
    AND LOCATE(CONCAT(',', b.WFDetailID, ','), CONCAT(',', vValidateID)) > 0
    AND UPPER(a.AppTableName) = 'TRNVCFORM' AND UPPER(a.AppKeyName) = 'VCFORMID'
    AND a.AppKey = c.VCFormID AND a.AppEmID = c.EmployeeID
    AND LOCATE(CONCAT(',', c.EmployeeID, ','), CONCAT(',', vEmployeeIDs)) > 0
    GROUP BY a.WFStepBasicID,
             a.AppKey,
             a.AppEmID,
             b.DtWFStatus;
  ELSE
    SELECT
      a.WFStepBasicID,
      a.AppKey,
      a.AppEmID,
      b.DtWFStatus
    FROM TrnWFStepBasic a,
         TrnWFDetail b,
         TrnVCForm c
    WHERE a.WFStepBasicID = b.WFStepBasicID AND a.DWFType = 3 AND a.FlgNew = 1
    AND LOCATE(CONCAT(',', b.WFDetailID, ','), CONCAT(',', vValidateID)) > 0
    AND UPPER(a.AppTableName) = 'TRNVCFORM' AND UPPER(a.AppKeyName) = 'VCFORMID'
    AND a.AppKey = c.VCFormID AND a.AppEmID = c.EmployeeID
    GROUP BY a.WFStepBasicID,
             a.AppKey,
             a.AppEmID,
             b.DtWFStatus;
  END IF;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP PROCEDURE IF EXISTS ivggs_whs.procWFQueryWH$$
CREATE
PROCEDURE ivggs_whs.procWFQueryWH (IN inUserID int, IN insSchString varchar(128), OUT outResult int)
BEGIN
  DECLARE vObjYM char(6);
  DECLARE vEmployeeID varchar(12);

  DECLARE vValidateID varchar(2048);
  DECLARE vTempIndex int;
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET outResult = - 100;
  SET outResult = 1;
  /**条件语句 = ‘员工ID；对象年月’ **/
  SET vEmployeeID = fnGetStrArrayAtIndex(insSchString, ';', 1, FALSE);
  SET vObjYM = fnGetStrArrayAtIndex(insSchString, ';', 2, FALSE);

  SET @uSQL1 = 'SELECT GROUP_CONCAT(t.WFDetailID SEPARATOR \',\') into @uResult1 FROM (
  SELECT CONVERT(e.WFDetailID, char) AS WFDetailID
  FROM VW_ConfirmWFInfo a,
     RtnEmployeeOrg b,
     MstPosition c,
     TrnWFStepBasic d,
     TrnWFDetail e
  WHERE a.PositionID = b.PositionID AND a.OrgCD = b.OrgCD AND b.PositionID = c.PositionID
  AND d.WFStepBasicID = e.WFStepBasicID AND e.CurrentWFStepID = a.WFStepID AND a.TableName = d.AppTableName AND a.KeyName = d.AppKeyName
  AND d.DWFType = 1 AND d.FlgNew = 1
  AND a.DWFType = d.DWFType AND a.FlgApproveStep = 1
  AND b.EmployeeID = @inUserID @AppEmID
  AND @vObjYM >= SUBSTR(a.DtFrom, 1, 6) AND @vObjYM <= SUBSTR(a.DtTo, 1, 6)
  AND @vObjYM >= SUBSTR(b.UsefulFromDt, 1, 6) AND @vObjYM <= SUBSTR(b.UsefulToDt, 1, 6)
  AND c.FlgCanApprove = 1
  GROUP BY e.WFDetailID ) t ';

  SET @uSQL1 = REPLACE(@uSQL1, '@vObjYM', vObjYM);
  SET @uSQL1 = REPLACE(@uSQL1, '@inUserID', inUserID);
  IF LENGTH(TRIM(vEmployeeID)) > 0 THEN
    SET @uSQL1 = REPLACE(@uSQL1, '@AppEmID', REPLACE('AND d.AppEmID = (@employeeID)', '@employeeID', vEmployeeID));
  ELSE
    SET @uSQL1 = REPLACE(@uSQL1, '@AppEmID', '');
  END IF;



  PREPARE stmt1 FROM @uSQL1;
  EXECUTE stmt1;
  DEALLOCATE PREPARE stmt1;

  IF @uResult1 IS NULL THEN
    SET @uResult1 = '';
  END IF;


  SET @uSQL1 = 'SELECT GROUP_CONCAT(t.WFDetailID SEPARATOR \',\') into @uResult2 FROM (
  SELECT CONVERT(e.WFDetailID, char) AS WFDetailID
  FROM VW_ConfirmWFInfo a,
     RtnEmployeeOrg b,
     MstPosition c,
     TrnWFStepBasic d,
     TrnWFDetail e,
     VW_ProxyInfo f
  WHERE a.PositionID = b.PositionID AND a.OrgCD = b.OrgCD AND b.PositionID = c.PositionID
  AND d.WFStepBasicID = e.WFStepBasicID AND e.CurrentWFStepID = a.WFStepID AND a.TableName = d.AppTableName AND a.KeyName = d.AppKeyName
  AND d.DWFType = 1  AND d.FlgNew = 1
  AND a.DWFType = d.DWFType AND a.FlgApproveStep = 1
  AND @vObjYM >= SUBSTR(a.DtFrom, 1, 6) AND @vObjYM <= SUBSTR(a.DtTo, 1, 6)
  AND @vObjYM >= SUBSTR(b.UsefulFromDt, 1, 6) AND @vObjYM <= SUBSTR(b.UsefulToDt, 1, 6) 
  AND f.WFStepID = a.WFStepID @AppEmID
  AND @vObjYM >= SUBSTR(f.FromDt, 1, 6) AND @vObjYM <= SUBSTR(f.ToDt, 1, 6)
  AND f.AgentID = @inUserID AND f.EmployeeID = d.AppEmID AND b.EmployeeID = f.ClientID
  AND c.FlgCanApprove = 1 
  GROUP BY e.WFDetailID ) t ';

  SET @uSQL1 = REPLACE(@uSQL1, '@vObjYM', vObjYM);
  SET @uSQL1 = REPLACE(@uSQL1, '@inUserID', inUserID);
  IF LENGTH(TRIM(vEmployeeID)) > 0 THEN
    SET @uSQL1 = REPLACE(@uSQL1, '@AppEmID', REPLACE('AND d.AppEmID = (@employeeID)', '@employeeID', vEmployeeID));
  ELSE
    SET @uSQL1 = REPLACE(@uSQL1, '@AppEmID', '');
  END IF;

  PREPARE stmt1 FROM @uSQL1;
  EXECUTE stmt1;
  DEALLOCATE PREPARE stmt1;

  IF @uResult2 IS NULL THEN
    SET @uResult2 = '';
  END IF;

  IF LENGTH(@uResult1) > 0 THEN
    SET @uSQL1 = 'SELECT GROUP_CONCAT(t.WFDetailID SEPARATOR \',\') into @uResult3 FROM (
  SELECT CONVERT(e.WFDetailID, char) AS WFDetailID
  FROM VW_ConfirmWFInfo a,
     RtnEmployeeOrg b,
     MstPosition c,
     TrnWFStepBasic d,
     TrnWFDetail e,
     VW_ProxyInfo f
  WHERE a.PositionID = b.PositionID AND a.OrgCD = b.OrgCD AND b.PositionID = c.PositionID
  AND d.WFStepBasicID = e.WFStepBasicID AND e.CurrentWFStepID = a.WFStepID AND a.TableName = d.AppTableName AND a.KeyName = d.AppKeyName
  AND d.DWFType = 1  AND d.FlgNew = 1
  AND a.DWFType = d.DWFType AND a.FlgApproveStep = 1
  AND @vObjYM >= SUBSTR(a.DtFrom, 1, 6) AND @vObjYM <= SUBSTR(a.DtTo, 1, 6)
  AND @vObjYM >= SUBSTR(b.UsefulFromDt, 1, 6) AND @vObjYM <= SUBSTR(b.UsefulToDt, 1, 6) 
  AND f.WFStepID = a.WFStepID  @AppEmID
  AND @vObjYM >= SUBSTR(f.FromDt, 1, 6) AND @vObjYM <= SUBSTR(f.ToDt, 1, 6)
  AND f.ClientID = @inUserID AND f.FlgShare = 2 AND b.EmployeeID = f.ClientID AND f.EmployeeID = d.AppEmID
  AND c.FlgCanApprove = 1 
  GROUP BY e.WFDetailID ) t ';

    SET @uSQL1 = REPLACE(@uSQL1, '@vObjYM', vObjYM);
    SET @uSQL1 = REPLACE(@uSQL1, '@inUserID', inUserID);
    IF LENGTH(TRIM(vEmployeeID)) > 0 THEN
      SET @uSQL1 = REPLACE(@uSQL1, '@AppEmID', REPLACE('AND d.AppEmID = (@employeeID)', '@employeeID', vEmployeeID));
    ELSE
      SET @uSQL1 = REPLACE(@uSQL1, '@AppEmID', '');
    END IF;

    PREPARE stmt1 FROM @uSQL1;
    EXECUTE stmt1;
    DEALLOCATE PREPARE stmt1;

    IF @uResult3 IS NULL THEN
      SET @uResult3 = '';
    END IF;

    IF LENGTH(@uResult3) > 0 THEN
      SET @uResult1 = ivggs_whs.fnReplaceStrArray(@uResult1, @uResult3, ',', '');
    END IF;
  END IF;


  SET vValidateID = CONCAT(@uResult1, ',', @uResult2, ',');

  IF LENGTH(TRIM(vEmployeeID)) > 0 THEN
    SET vEmployeeID = CONCAT(vEmployeeID, ',');

    SELECT
      a.WFStepBasicID,
      a.AppKey,
      a.AppEmID,
      b.DtWFStatus,
      b.OptID,
      b.OptPositionID,
      b.OptOrgCD
    FROM trnwfstepbasic a,
         trnwfdetail b,
         trnwhform c
    WHERE a.WFStepBasicID = b.WFStepBasicID AND a.DWFType = 1 AND a.FlgNew = 1
    AND LOCATE(CONCAT(',', b.WFDetailID, ','), CONCAT(',', vValidateID)) > 0
    AND UPPER(a.AppTableName) = 'TRNWHFORM' AND UPPER(a.AppKeyName) = 'WHFORMID'
    AND a.AppKey = c.WHFormID AND a.AppEmID = c.EmployeeID
    AND LOCATE(CONCAT(',', c.EmployeeID, ','), CONCAT(',', vEmployeeID)) > 0
    AND b.FlowNo = (SELECT
        MAX(t.FlowNo)
      FROM trnwfdetail t
      WHERE t.WFStepBasicID = a.WFStepBasicID)
    GROUP BY a.WFStepBasicID,
             a.AppKey,
             a.AppEmID,
             b.DtWFStatus,
             b.OptID,
             b.OptPositionID,
             b.OptOrgCD;
  ELSE
    SELECT
      a.WFStepBasicID,
      a.AppKey,
      a.AppEmID,
      b.DtWFStatus,
      b.OptID,
      b.OptPositionID,
      b.OptOrgCD
    FROM trnwfstepbasic a,
         trnwfdetail b,
         trnwhform c
    WHERE a.WFStepBasicID = b.WFStepBasicID AND a.DWFType = 1 AND a.FlgNew = 1
    AND LOCATE(CONCAT(',', b.WFDetailID, ','), CONCAT(',', vValidateID)) > 0
    AND UPPER(a.AppTableName) = 'TRNWHFORM' AND UPPER(a.AppKeyName) = 'WHFORMID'
    AND a.AppKey = c.WHFormID AND a.AppEmID = c.EmployeeID
    AND b.FlowNo = (SELECT
        MAX(t.FlowNo)
      FROM trnwfdetail t
      WHERE t.WFStepBasicID = a.WFStepBasicID)
    GROUP BY a.WFStepBasicID,
             a.AppKey,
             a.AppEmID,
             b.DtWFStatus,
             b.OptID,
             b.OptPositionID,
             b.OptOrgCD;
  END IF;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP PROCEDURE IF EXISTS ivggs_whs.procWFReject$$
CREATE
PROCEDURE ivggs_whs.procWFReject (IN inObjYMD char(8), IN inWFType int, IN inTableKey int, IN inUserID int, IN inOrgCD varchar(64), IN inPositionID int
, IN inMemo varchar(512), OUT outResult int)
LBL_EXIT:
BEGIN
  /**
  输入参数：	wfType INT 流程类型；取业务字典FlowType值：1工时；2加班；3休假	
	tableKey  INT 相关表单主键	
	userID INT 提交用户员工ID	
	orgCD Char 提交用户当前的组织编码	
	positionID INT 提交用户的职位ID	
	memo  Varchar(512) 说明	
返回参数：	result INT
	1：成功
	-1:当前没有流程定义
	-100:SQL执行错误；
简易操作：一驳到底；任一驳回
  **/
  DECLARE vTargetWFBasicID int;
  DECLARE vTargetDetails varchar(1024);
  DECLARE vTargetDetailsProxy varchar(512);
  DECLARE vTargetDetailsExculde varchar(512);
  DECLARE vTempID int;
  DECLARE vTempTableName varchar(128);
  DECLARE vTempKeyName varchar(128);
  DECLARE vTempKeyID int;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION SET outResult = - 100;

  SELECT
    t.WFStepBasicID INTO vTargetWFBasicID
  FROM trnwfstepbasic t
  WHERE t.DWFType = inWFType AND t.AppKey = inTableKey AND t.FlgNew = 1
  ORDER BY t.UpdateTime DESC LIMIT 1;

  IF vTargetWFBasicID IS NULL THEN
    SET outResult = - 1;
    LEAVE LBL_EXIT;
  END IF;

  /*** 修正用户的组织编码和职位ID 因用户可能有多个职位，传入的为用户的主职，其他职位可能有审批权 ***/
  SELECT
    c.OptOrgCD,
    c.OptPositionID INTO inOrgCD, inPositionID
  FROM rtnemployeeorg a,
       trnwfstepbasic b,
       trnwfdetail c
  WHERE a.EmployeeID = inUserID AND b.WFStepBasicID = c.WFStepBasicID AND b.WFStepBasicID = vTargetWFBasicID
  AND b.AppKey = inTableKey AND b.DWFType = inWFType AND c.DtWFStatus IN (1, 3) AND b.FlgNew = 1
  AND a.PositionID = c.OptPositionID AND a.OrgCD = c.OptOrgCD
  ORDER BY c.UpdateTime DESC LIMIT 1;

  /**1.查询当前用户是否有审批权**/
  /**1.1 直接审批权**/
  SELECT
    GROUP_CONCAT(t.WFDetailID SEPARATOR ',') INTO vTargetDetails
  FROM (SELECT
      e.WFDetailID
    FROM vw_confirmwfinfo a,
         rtnemployeeorg b,
         mstposition c,
         trnwfstepbasic d,
         trnwfdetail e,
         vw_commitwfinfo h
    WHERE a.PositionID = b.PositionID AND a.OrgCD = b.OrgCD AND b.PositionID = c.PositionID
    AND d.WFStepBasicID = e.WFStepBasicID AND e.CurrentWFStepID = a.WFStepID
    AND d.DtWFStatus = 1 AND d.AppTableName = a.TableName AND d.AppKeyName = a.KeyName AND d.AppKey = inTableKey
    AND d.DWFType = a.DWFType AND d.DWFType = inWFType AND e.DtWFStatus IN (1, 3) AND d.FlgNew = 1
    AND a.FlgApproveStep = 1 AND a.PositionID = inPositionID AND a.OrgCD = inOrgCD
    AND inObjYMD >= a.DtFrom AND inObjYMD <= a.DtTo AND inObjYMD >= b.UsefulFromDt AND inObjYMD <= b.UsefulToDt
    AND c.FlgCanApprove = 1 AND b.EmployeeID = inUserID AND d.WFStepBasicID = vTargetWFBasicID
    AND d.AppEmPositionID = h.PositionID AND d.AppEmOrgCD = h.OrgCD AND d.DWFType = h.DWFType AND a.WFExtID = h.WFExtID
    GROUP BY e.WFDetailID) t;
  IF vTargetDetails IS NULL THEN
    SET vTargetDetails = '';
  END IF;

  /**1.2 代理审批权**/
  SELECT
    GROUP_CONCAT(t.WFDetailID SEPARATOR ',') INTO vTargetDetailsProxy
  FROM (SELECT
      e.WFDetailID
    FROM vw_confirmwfinfo a,
         rtnemployeeorg b,
         mstposition c,
         trnwfstepbasic d,
         trnwfdetail e,
         vw_proxyinfo f,
         vw_commitwfinfo h
    WHERE a.PositionID = b.PositionID AND a.OrgCD = b.OrgCD AND b.PositionID = c.PositionID
    AND d.WFStepBasicID = e.WFStepBasicID AND e.CurrentWFStepID = a.WFStepID
    AND d.DtWFStatus = 1 AND d.AppTableName = a.TableName AND d.AppKeyName = a.KeyName AND d.AppKey = inTableKey
    AND d.DWFType = a.DWFType AND d.DWFType = inWFType AND e.DtWFStatus IN (1, 3) AND d.FlgNew = 1
    AND a.FlgApproveStep = 1 /** AND a.PositionID = inPositionID AND a.OrgCD = inOrgCD **/
    AND inObjYMD >= a.DtFrom AND inObjYMD <= a.DtTo AND inObjYMD >= b.UsefulFromDt AND inObjYMD <= b.UsefulToDt AND inObjYMD >= f.FromDt AND inObjYMD <= f.ToDt
    AND f.WFStepID = a.WFStepID AND f.ClientID = b.EmployeeID AND f.AgentID = inUserID AND f.EmployeeID = d.AppEmID
    AND c.FlgCanApprove = 1 AND d.WFStepBasicID = vTargetWFBasicID
    AND d.AppEmPositionID = h.PositionID AND d.AppEmOrgCD = h.OrgCD AND d.DWFType = h.DWFType AND a.WFExtID = h.WFExtID
    GROUP BY e.WFDetailID) t;
  IF vTargetDetailsProxy IS NULL THEN
    SET vTargetDetailsProxy = '';
  END IF;

  /**若1.1 存在流程则进行1.3操作	**/
  /**1.3 排除已经被代理出去且共享标志为不共享的流程	**/
  IF LENGTH(vTargetDetails) > 0 THEN
    SELECT
      GROUP_CONCAT(t.WFDetailID SEPARATOR ',') INTO vTargetDetailsExculde
    FROM (SELECT
        e.WFDetailID
      FROM vw_confirmwfinfo a,
           rtnemployeeorg b,
           mstposition c,
           trnwfstepbasic d,
           trnwfdetail e,
           vw_proxyinfo f,
           vw_commitwfinfo h
      WHERE a.PositionID = b.PositionID AND a.OrgCD = b.OrgCD AND b.PositionID = c.PositionID
      AND d.WFStepBasicID = e.WFStepBasicID AND e.CurrentWFStepID = a.WFStepID
      AND d.DtWFStatus = 1 AND d.AppTableName = a.TableName AND d.AppKeyName = a.KeyName AND d.AppKey = inTableKey
      AND d.DWFType = a.DWFType AND d.DWFType = inWFType AND e.DtWFStatus IN (1, 3) AND d.FlgNew = 1
      AND a.FlgApproveStep = 1 AND a.PositionID = inPositionID AND a.OrgCD = inOrgCD
      AND inObjYMD >= a.DtFrom AND inObjYMD <= a.DtTo AND inObjYMD >= b.UsefulFromDt AND inObjYMD <= b.UsefulToDt AND inObjYMD >= f.FromDt AND inObjYMD <= f.ToDt
      AND f.WFStepID = a.WFStepID AND f.ClientID = b.EmployeeID AND f.ClientID = inUserID AND f.EmployeeID = d.AppEmID AND f.FlgShare = 2
      AND c.FlgCanApprove = 1 AND d.WFStepBasicID = vTargetWFBasicID
      AND d.AppEmPositionID = h.PositionID AND d.AppEmOrgCD = h.OrgCD AND d.DWFType = h.DWFType AND a.WFExtID = h.WFExtID
      GROUP BY e.WFDetailID) t;
    IF vTargetDetailsExculde IS NULL THEN
      SET vTargetDetailsExculde = '';
    END IF;

    IF LENGTH(vTargetDetailsExculde) > 0 THEN
      SET vTargetDetails = fnReplaceStrArray(vTargetDetails, vTargetDetailsExculde, ',', '');
    END IF;

  END IF;
  /**1.4 流程存在判断 **/


  IF LENGTH(vTargetDetails) = 0 AND LENGTH(vTargetDetailsProxy) = 0 THEN
    SET outResult = - 1;
    LEAVE LBL_EXIT;
  END IF;

  /**2.完结所有工作流程 **/
  /**2.1 若1.1工作流程ID存在，则**/
  IF LENGTH(vTargetDetails) > 0 THEN
    SET vTargetDetails = CONCAT(vTargetDetails, ',');
    UPDATE trnwfdetail t
    SET t.DtWFStatus = 12,
        t.OptID = inUserID,
        t.OptTime = CURRENT_TIMESTAMP(),
        t.OpeDes = inMemo,
        t.UpdateTime = CURRENT_TIMESTAMP()
    WHERE t.DtWFStatus IN (1, 3) AND t.WFStepBasicID = vTargetWFBasicID AND LOCATE(CONCAT(',', t.WFDetailID, ','), CONCAT(',', vTargetDetails)) > 0;
  END IF;
  /**2.2 若1.2工作流程ID存在，则**/
  IF LENGTH(vTargetDetailsProxy) > 0 THEN
    SET vTargetDetailsProxy = CONCAT(vTargetDetailsProxy, ',');
    INSERT INTO trnwfproxy (WFDetailID, AgentID, ClientID)
      SELECT
        b.WFDetailID,
        c.AgentID,
        c.ClientID
      FROM trnwfstepbasic a,
           trnwfdetail b,
           vw_proxyinfo c
      WHERE a.WFStepBasicID = b.WFStepBasicID AND c.WFStepID = b.CurrentWFStepID
      AND c.AgentID = inUserID AND c.EmployeeID = a.AppEmID AND a.WFStepBasicID = vTargetWFBasicID
      AND inObjYMD >= c.FromDt AND inObjYMD <= c.ToDt AND b.DtWFStatus IN (1, 3) AND a.FlgNew = 1
      AND LOCATE(CONCAT(',', b.WFDetailID, ','), CONCAT(',', vTargetDetailsProxy)) > 0
      GROUP BY b.WFDetailID,
               c.AgentID,
               c.ClientID;

    UPDATE trnwfdetail t
    SET t.DtWFStatus = 12,
        t.OptID = inUserID,
        t.OptPositionID = inPositionID,
        t.OptOrgCD = inOrgCD,
        t.OptTime = CURRENT_TIMESTAMP(),
        t.UpdateTime = CURRENT_TIMESTAMP()
    WHERE t.DtWFStatus IN (1, 3) AND LOCATE(CONCAT(',', t.WFDetailID, ','), CONCAT(',', vTargetDetailsProxy)) > 0 AND t.WFStepBasicID = vTargetWFBasicID;
  END IF;

  /**2.3 更新本步工作流程，简易操作：一驳到底，任一驳回**/
  UPDATE trnwfdetail
  SET DtWFStatus = 12,
      OptTime = CURRENT_TIMESTAMP(),
      UpdateTime = CURRENT_TIMESTAMP()
  WHERE WFStepBasicID = vTargetWFBasicID;

  /**2.6 更新处理流程状态**/
  UPDATE trnwfstepbasic
  SET DtWFStatus = 2,
      UpdateTime = CURRENT_TIMESTAMP(),
      UpdateBy = inUserID
  WHERE WFStepBasicID = vTargetWFBasicID;

  /**2.7 更新表单状态 **/

  SELECT
    t.AppTableName,
    t.AppKeyName,
    t.AppKey INTO vTempTableName, vTempKeyName, vTempKeyID
  FROM trnwfstepbasic t
  WHERE t.WFStepBasicID = vTargetWFBasicID;

  SET @uSQL = ' UPDATE @tablename
    SET DtAppStatus = 3,
        UpdateTime = CURRENT_TIMESTAMP(),
        UpdateBy = @inUserID
    WHERE @tablekey = @keyid';
  SET @uSQL = REPLACE(@uSQL, '@tablename', vTempTableName);
  SET @uSQL = REPLACE(@uSQL, '@tablekey', vTempKeyName);
  SET @uSQL = REPLACE(@uSQL, '@keyid', vTempKeyID);
  SET @uSQL = REPLACE(@uSQL, '@inUserID', inUserID);
  PREPARE stmt FROM @uSQL;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt;

  /**加班、休假驳回时连带驳回考勤信息 **/
  IF inWFType = 2 OR inWFType = 3 THEN
    CALL procRejectWHWF(inObjYMD, inWFType, inTableKey, inUserID, inOrgCD, inPositionID, outResult);
    IF outResult < 0 THEN
      LEAVE LBL_EXIT;
    END IF;
  END IF;

  SET outResult = 1;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP PROCEDURE IF EXISTS ivggs_whs.procWFSubmit$$
CREATE
PROCEDURE ivggs_whs.procWFSubmit (IN inObjYMD char(8), IN inWFType int, IN inTableKey int, IN inUserID int, IN inOrgCD varchar(64), IN inPositionID int
, IN inMemo varchar(512), OUT outResult int)
LBL_EXIT:
BEGIN
  /**
  输入参数：	wfType    INT 流程类型；取业务字典FlowType值：1工时；2加班；3休假	
	tableKey  INT 相关表单主键	
	userID    INT 提交用户员工ID	
	orgCD     Char 提交用户当前的组织编码	
	positionID INT 提交用户的职位ID	
	objYMD    Char(6) 表单对象日YYYYMMDD	
	memo      Varchar(512) 说明	

返回参数：	result INT
	1：成功
	-1:当前没有流程定义
	-2:当前存在多个流程定义；
  -3: 加班申请时，工时已经在申请/提交状态
  -4: 休假申请时，工时已经在申请/提交状态
	-100:SQL执行错误；
  **/
  DECLARE vTempCount int;
  DECLARE vTarWFExtID int;
  DECLARE vWFStepBasicID int;
  DECLARE vWFNextStepID int;

  DECLARE vTablename varchar(128);
  DECLARE vKeyName varchar(64);
  DECLARE vAppStatus smallint;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION SET outResult = - 100;
  SET outResult = 1;
  SELECT
    COUNT(*) INTO vTempCount
  FROM (SELECT
      b.WFExtID
    FROM MstWFVersion a,
         MstWFExt b,
         MstWFStep c,
         RtnWFPosition d
    WHERE a.WFVersionID = b.WFVersionID AND b.WFExtID = c.WFExtID AND b.WFExtID = d.WFExtID AND c.WFStepID = d.WFStepID
    AND b.DWFType = inWFType AND c.FlgCreateStep = 1 AND d.PositionID = inPositionID AND d.OrgCD = inOrgCD
    AND inObjYMD >= a.DtFrom AND inObjYMD <= a.DtTo
    GROUP BY b.WFExtID) t;

  IF vTempCount = 0 THEN
    SET outResult = - 1;
    LEAVE LBL_EXIT;
  END IF;

  IF vTempCount > 1 THEN
    SET outResult = - 2;
    LEAVE LBL_EXIT;
  END IF;

  /**
   *流程联动校验 /0：未申请；1：已提交；2：已承认；3：已驳回
   *1：加班申请：工时未申请/已驳回
   *2：休假申请：工时未申请/已驳回
  **/
  IF inWFType = 2 THEN
    SELECT
      a.DtAppStatus INTO vAppStatus
    FROM TrnWHForm a
    WHERE a.ObjYMD = inObjYMD AND a.EmployeeID = inUserID AND a.DelFlg = '0';

    IF ISNULL(vAppStatus) = 0 THEN
      IF vAppStatus = 1 OR vAppStatus = 2 THEN
        SET outResult = - 3;
        LEAVE LBL_EXIT;
      END IF;
    END IF;
  END IF;

  IF inWFType = 3 THEN
    SELECT
      MAX(a.DtAppStatus) INTO vAppStatus
    FROM TrnWHForm a
    WHERE a.EmployeeID = inUserID AND a.DelFlg = '0' AND a.ObjYMD IN (SELECT
        n.ObjYMD
      FROM TrnVCForm m,
           TrnVCFormDetail n
      WHERE m.VCFormID = n.VCFormID AND m.EmployeeID = inUserID
      AND m.ApplyDate = inObjYMD AND m.DelFlg = '0'
      GROUP BY n.ObjYMD) AND a.DtAppStatus IN (0, 3);

    IF ISNULL(vAppStatus) = 0 THEN
      IF vAppStatus = 1 OR vAppStatus = 2 THEN
        SET outResult = - 4;
        LEAVE LBL_EXIT;
      END IF;
    END IF;
  END IF;


  SELECT
    b.WFExtID,
    MAX(b.TableName),
    MAX(b.KeyName) INTO vTarWFExtID, vTablename, vKeyName
  FROM MstWFVersion a,
       MstWFExt b,
       MstWFStep c,
       RtnWFPosition d
  WHERE a.WFVersionID = b.WFVersionID AND b.WFExtID = c.WFExtID AND b.WFExtID = d.WFExtID AND c.WFStepID = d.WFStepID
  AND b.DWFType = inWFType AND c.FlgCreateStep = 1 AND d.PositionID = inPositionID AND d.OrgCD = inOrgCD
  AND inObjYMD >= a.DtFrom AND inObjYMD <= a.DtTo
  GROUP BY b.WFExtID LIMIT 1;

  /** 处理工作流程基本表中的最新标志 **/
  UPDATE TrnWFStepBasic
  SET FlgNew = 2
  WHERE DWFType = inWFType AND AppKey = inTableKey;

  INSERT INTO TrnWFStepBasic (WFName, WFCD, DWFType, DtWFStatus, AppTableName, AppKeyName, AppKey, AppEmID, AppEmPositionID, AppEmOrgCD, AppSubmitTime, AppTime, DelFlg, CreateTime, CreateBy, UpdateTime, UpdateBy, FlgNew)
    SELECT
      CONCAT(inWFType, '_', inUserID, '_', inObjYMD),
      CONCAT(inWFType, '_', inUserID),
      inWFType,
      1,
      m.TableName,
      m.KeyName,
      inTableKey,
      inUserID,
      inPositionID,
      inOrgCD,
      CURRENT_TIMESTAMP(),
      inObjYMD,
      0,
      CURRENT_TIMESTAMP(),
      inUserID,
      CURRENT_TIMESTAMP(),
      inUserID,
      1
    FROM MstWFExt m
    WHERE m.WFExtID = vTarWFExtID;
  SET vWFStepBasicID = LAST_INSERT_ID();

  INSERT INTO TrnWFDetail (WFStepBasicID, WFCD, FlowName, FlowNo, CurrentWFStepID, RejectWFStepID, NextWFStepID, FlgApprove, FlgReject, DtWFStatus, OptID, OptPositionID, OptOrgCD, OptTime, OpeDes, CreateTime, UpdateTime)
    SELECT
      vWFStepBasicID,
      CONCAT(inWFType, '_', inUserID, '_', inObjYMD),
      m.StepName,
      m.StepNo,
      m.WFStepID,
      m.RejectStepID,
      m.NextStepID,
      0,
      0,
      2,
      inUserID,
      inPositionID,
      inOrgCD,
      CURRENT_TIMESTAMP(),
      inMemo,
      CURRENT_TIMESTAMP(),
      CURRENT_TIMESTAMP()
    FROM MstWFStep m
    WHERE m.WFExtID = vTarWFExtID AND m.FlgCreateStep = 1;

  SELECT
    m.NextStepID INTO vWFNextStepID
  FROM MstWFStep m
  WHERE m.WFExtID = vTarWFExtID AND m.FlgCreateStep = 1;

  INSERT INTO TrnWFDetail (WFStepBasicID, WFCD, FlowName, FlowNo, CurrentWFStepID, RejectWFStepID, NextWFStepID, FlgApprove, FlgReject, DtWFStatus, OptID, OptPositionID, OptOrgCD, OptTime, OpeDes, CreateTime, UpdateTime)
    SELECT
      vWFStepBasicID,
      CONCAT(inWFType, '_', inUserID, '_', inObjYMD),
      m.StepName,
      m.StepNo,
      m.WFStepID,
      m.RejectStepID,
      m.NextStepID,
      m.FlgApprove,
      m.FlgReject,
      1,
      0,
      r.PositionID,
      r.OrgCD,
      NULL,
      NULL,
      CURRENT_TIMESTAMP(),
      CURRENT_TIMESTAMP()
    FROM MstWFStep m,
         RtnWFPosition r
    WHERE m.WFStepID = r.WFStepID AND m.WFExtID = r.WFExtID AND m.WFStepID = vWFNextStepID AND m.WFExtID = vTarWFExtID;


  SET @uSQL = ' UPDATE @tablename
    SET DtAppStatus = 1,
        UpdateTime = CURRENT_TIMESTAMP(),
        UpdateBy = @inUserID
    WHERE @tablekey = @keyid';
  SET @uSQL = REPLACE(@uSQL, '@tablename', vTablename);
  SET @uSQL = REPLACE(@uSQL, '@tablekey', vKeyName);
  SET @uSQL = REPLACE(@uSQL, '@keyid', inTableKey);
  SET @uSQL = REPLACE(@uSQL, '@inUserID', inUserID);

  PREPARE stmt1 FROM @uSQL;
  EXECUTE stmt1;
  DEALLOCATE PREPARE stmt1;


  SET outResult = 1;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP PROCEDURE IF EXISTS ivggs_whs.procWFUnConfirm$$
CREATE
PROCEDURE ivggs_whs.procWFUnConfirm (IN inObjYMD char(8), IN inWFType int, IN inTableKey int, IN inUserID int, IN inOrgCD varchar(64), IN inPositionID int
, IN inMemo varchar(512), OUT outResult int)
LBL_EXIT:
BEGIN
  /**
  输入参数：	wfType INT 流程类型；取业务字典FlowType值：1工时；2加班；3休假	
	tableKey  INT 相关表单主键	
	userID INT 提交用户员工ID	
	orgCD Char 提交用户当前的组织编码	
	positionID INT 提交用户的职位ID	
	memo  Varchar(512) 说明	

  返回参数：	result INT
	1：成功
	-1:当前没有流程定义
	-2:考勤审核取消时，考勤信息已经被人事导出
  -3:传入考勤记录不存在
	-100:SQL执行错误；
  **/
  DECLARE vTargetWFBasicID int;
  DECLARE vTargetDetails varchar(1024);
  DECLARE vTargetDetailsProxy varchar(512);
  DECLARE vTargetDetailsExculde varchar(512);

  DECLARE vTempIDs varchar(1024);
  DECLARE vTempID int;
  DECLARE vTempTableName varchar(128);
  DECLARE vTempKeyName varchar(128);
  DECLARE vTempKeyID int;
  DECLARE vTempFlg smallint;

  DECLARE vAppStatus smallint;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION SET outResult = - 100;

  /**若为考勤审核取消，则查看相关人事导出标志，若已导出，则返回-2**/
  IF inWFType = 1 THEN
    SELECT
      t.FlgHR INTO vTempFlg
    FROM TrnWHForm t
    WHERE t.WHFormID = inTableKey AND t.DelFlg = '0';
    IF vTempFlg IS NULL THEN
      SET outResult = - 3;
      LEAVE LBL_EXIT;
    END IF;

    IF vTempFlg = 1 THEN
      SET outResult = - 2;
      LEAVE LBL_EXIT;
    END IF;
  END IF;

  SELECT
    t.WFStepBasicID INTO vTargetWFBasicID
  FROM TrnWFStepBasic t
  WHERE t.DWFType = inWFType AND t.AppKey = inTableKey AND t.FlgNew = 1
  ORDER BY t.UpdateTime DESC LIMIT 1;

  IF vTargetWFBasicID IS NULL THEN
    SET outResult = - 1;
    LEAVE LBL_EXIT;
  END IF;

  /*** 修正用户的组织编码和职位ID 因用户可能有多个职位，传入的为用户的主职，其他职位可能有审批权 ***/
  SELECT
    c.OptOrgCD,
    c.OptPositionID INTO inOrgCD, inPositionID
  FROM RtnEmployeeOrg a,
       TrnWFStepBasic b,
       TrnWFDetail c
  WHERE a.EmployeeID = inUserID AND b.WFStepBasicID = c.WFStepBasicID AND b.WFStepBasicID = vTargetWFBasicID
  AND b.AppKey = inTableKey AND b.DWFType = inWFType AND c.DtWFStatus = 2 AND b.FlgNew = 1
  AND a.PositionID = c.OptPositionID AND a.OrgCD = c.OptOrgCD
  ORDER BY c.UpdateTime DESC LIMIT 1;

  /**1.查询当前用户是否有审批权**/
  /**1.1 直接审批权**/
  SELECT
    GROUP_CONCAT(t.WFDetailID SEPARATOR ',') INTO vTargetDetails
  FROM (SELECT
      e.WFDetailID
    FROM VW_ConfirmWFInfo a,
         RtnEmployeeOrg b,
         MstPosition c,
         TrnWFStepBasic d,
         TrnWFDetail e,
         VW_CommitWFInfo h
    WHERE a.PositionID = b.PositionID AND a.OrgCD = b.OrgCD AND b.PositionID = c.PositionID
    AND d.WFStepBasicID = e.WFStepBasicID AND e.CurrentWFStepID = a.WFStepID
    AND d.AppTableName = a.TableName AND d.AppKeyName = a.KeyName AND d.AppKey = inTableKey
    AND d.DWFType = a.DWFType AND d.DWFType = inWFType AND e.DtWFStatus = 2 AND d.FlgNew = 1
    AND a.PositionID = inPositionID AND a.OrgCD = inOrgCD
    AND inObjYMD >= a.DtFrom AND inObjYMD <= a.DtTo AND inObjYMD >= b.UsefulFromDt AND inObjYMD <= b.UsefulToDt
    AND c.FlgCanApprove = 1 AND b.EmployeeID = inUserID AND d.WFStepBasicID = vTargetWFBasicID
    AND d.AppEmPositionID = h.PositionID AND d.AppEmOrgCD = h.OrgCD AND d.DWFType = h.DWFType AND a.WFExtID = h.WFExtID
    GROUP BY e.WFDetailID) t;
  IF vTargetDetails IS NULL THEN
    SET vTargetDetails = '';
  END IF;

  /**1.2 代理审批权**/
  SELECT
    GROUP_CONCAT(t.WFDetailID SEPARATOR ',') INTO vTargetDetailsProxy
  FROM (SELECT
      e.WFDetailID
    FROM VW_ConfirmWFInfo a,
         RtnEmployeeOrg b,
         MstPosition c,
         TrnWFStepBasic d,
         TrnWFDetail e,
         VW_ProxyInfo f,
         VW_CommitWFInfo h
    WHERE a.PositionID = b.PositionID AND a.OrgCD = b.OrgCD AND b.PositionID = c.PositionID
    AND d.WFStepBasicID = e.WFStepBasicID AND e.CurrentWFStepID = a.WFStepID
    AND d.AppTableName = a.TableName AND d.AppKeyName = a.KeyName AND d.AppKey = inTableKey
    AND d.DWFType = a.DWFType AND d.DWFType = inWFType AND e.DtWFStatus = 2 AND d.FlgNew = 1
    /** AND a.PositionID = inPositionID AND a.OrgCD = inOrgCD **/
    AND inObjYMD >= a.DtFrom AND inObjYMD <= a.DtTo AND inObjYMD >= b.UsefulFromDt AND inObjYMD <= b.UsefulToDt AND inObjYMD >= f.FromDt AND inObjYMD <= f.ToDt
    AND f.WFStepID = a.WFStepID AND f.ClientID = b.EmployeeID AND f.AgentID = inUserID AND f.EmployeeID = d.AppEmID
    AND c.FlgCanApprove = 1 AND d.WFStepBasicID = vTargetWFBasicID
    AND d.AppEmPositionID = h.PositionID AND d.AppEmOrgCD = h.OrgCD AND d.DWFType = h.DWFType AND a.WFExtID = h.WFExtID
    GROUP BY e.WFDetailID) t;
  IF vTargetDetailsProxy IS NULL THEN
    SET vTargetDetailsProxy = '';
  END IF;

  /**若1.1 存在流程则进行1.3操作	**/
  /**1.3 排除已经被代理出去且共享标志为不共享的流程	**/
  IF LENGTH(vTargetDetails) > 0 THEN
    SELECT
      GROUP_CONCAT(t.WFDetailID SEPARATOR ',') INTO vTargetDetailsExculde
    FROM (SELECT
        e.WFDetailID
      FROM VW_ConfirmWFInfo a,
           RtnEmployeeOrg b,
           MstPosition c,
           TrnWFStepBasic d,
           TrnWFDetail e,
           VW_ProxyInfo f,
           VW_CommitWFInfo h
      WHERE a.PositionID = b.PositionID AND a.OrgCD = b.OrgCD AND b.PositionID = c.PositionID
      AND d.WFStepBasicID = e.WFStepBasicID AND e.CurrentWFStepID = a.WFStepID
      AND d.AppTableName = a.TableName AND d.AppKeyName = a.KeyName AND d.AppKey = inTableKey
      AND d.DWFType = a.DWFType AND d.DWFType = inWFType AND e.DtWFStatus = 2 AND d.FlgNew = 1
      AND a.FlgApproveStep = 1 AND a.PositionID = inPositionID AND a.OrgCD = inOrgCD
      AND inObjYMD >= a.DtFrom AND inObjYMD <= a.DtTo AND inObjYMD >= b.UsefulFromDt AND inObjYMD <= b.UsefulToDt AND inObjYMD >= f.FromDt AND inObjYMD <= f.ToDt
      AND f.WFStepID = a.WFStepID AND f.ClientID = b.EmployeeID AND f.ClientID = inUserID AND f.EmployeeID = d.AppEmID AND f.FlgShare = 2
      AND c.FlgCanApprove = 1 AND d.WFStepBasicID = vTargetWFBasicID
      AND d.AppEmPositionID = h.PositionID AND d.AppEmOrgCD = h.OrgCD AND d.DWFType = h.DWFType AND a.WFExtID = h.WFExtID
      GROUP BY e.WFDetailID) t;
    IF vTargetDetailsExculde IS NULL THEN
      SET vTargetDetailsExculde = '';
    END IF;

    IF LENGTH(vTargetDetailsExculde) > 0 THEN
      SET vTargetDetails = fnReplaceStrArray(vTargetDetails, vTargetDetailsExculde, ',', '');
    END IF;

  END IF;
  /**1.4 流程存在判断 **/


  IF LENGTH(vTargetDetails) = 0 AND LENGTH(vTargetDetailsProxy) = 0 THEN
    SET outResult = - 1;
    LEAVE LBL_EXIT;
  END IF;

  /**2.处理当前工作流**/
  /**2.1 若1.1工作流程ID存在，则**/
  IF LENGTH(vTargetDetails) > 0 THEN
    SET vTargetDetails = CONCAT(vTargetDetails, ',');
    UPDATE TrnWFDetail t
    SET t.DtWFStatus = 3,
        t.OptID = inUserID,
        t.OptTime = CURRENT_TIMESTAMP(),
        t.OpeDes = inMemo,
        t.UpdateTime = CURRENT_TIMESTAMP()
    WHERE t.DtWFStatus = 2 AND t.WFStepBasicID = vTargetWFBasicID AND LOCATE(CONCAT(',', t.WFDetailID, ','), CONCAT(',', vTargetDetails)) > 0;
  END IF;
  /**2.2 若1.2工作流程ID存在，则**/
  IF LENGTH(vTargetDetailsProxy) > 0 THEN
    SET vTargetDetailsProxy = CONCAT(vTargetDetailsProxy, ',');
    UPDATE TrnWFDetail t
    SET t.DtWFStatus = 3,
        t.OptID = inUserID,
        t.OptPositionID = inPositionID,
        t.OptOrgCD = inOrgCD,
        t.OptTime = CURRENT_TIMESTAMP(),
        t.OpeDes = inMemo,
        t.UpdateTime = CURRENT_TIMESTAMP()
    WHERE t.DtWFStatus = 2 AND t.WFStepBasicID = vTargetWFBasicID AND LOCATE(CONCAT(',', t.WFDetailID, ','), CONCAT(',', vTargetDetailsProxy)) > 0;
  END IF;

  /**2.3 更新工作流程，更新可能的并行审批流程**/
  SET vTargetDetails = CONCAT(vTargetDetails, ',', vTargetDetailsProxy);
  SELECT
    GROUP_CONCAT(m.CurrentWFStepID SEPARATOR ',') INTO vTempIDs
  FROM (SELECT
      t.CurrentWFStepID
    FROM TrnWFDetail t
    WHERE LOCATE(CONCAT(',', t.WFDetailID, ','), CONCAT(',', vTargetDetails)) > 0 AND t.WFStepBasicID = vTargetWFBasicID
    GROUP BY t.CurrentWFStepID) m;
  SET vTempIDs = CONCAT(vTempIDs, ',');

  UPDATE TrnWFDetail t
  SET t.DtWFStatus = 3,
      t.OptTime = CURRENT_TIMESTAMP(),
      t.UpdateTime = CURRENT_TIMESTAMP()
  WHERE t.DtWFStatus = 2 AND LOCATE(CONCAT(',', t.CurrentWFStepID, ','), CONCAT(',', vTempIDs)) > 0 AND t.WFStepBasicID = vTargetWFBasicID;
  /**2.4.解锁前驱流程步骤**/
  UPDATE TrnWFDetail
  SET DtWFStatus = 2,
      UpdateTime = CURRENT_TIMESTAMP()
  WHERE WFStepBasicID = vTargetWFBasicID AND LOCATE(CONCAT(',', NextWFStepID, ','), CONCAT(',', vTempIDs)) > 0;

  /**5.对于加班和休假操作，将相关工时工作流退回初始状态（若存在）	
	调用procResetWHWF2First
  **/
  IF inWFType = 2 OR inWFType = 3 THEN
    CALL procResetWHWF2First(inObjYMD, inWFType, inTableKey, inUserID, inOrgCD, inPositionID, outResult);
    IF outResult < 0 THEN
      LEAVE LBL_EXIT;
    END IF;
  END IF;
  /**3.更新下一步流程	
	3.1 更新工作流程表
  **/
  SELECT
    GROUP_CONCAT(m.NextWFStepID SEPARATOR ',') INTO vTempIDs
  FROM (SELECT
      t.NextWFStepID
    FROM TrnWFDetail t
    WHERE LOCATE(CONCAT(',', t.WFDetailID, ','), CONCAT(',', vTargetDetails)) > 0 AND t.WFStepBasicID = vTargetWFBasicID
    GROUP BY t.CurrentWFStepID) m;
  IF vTempIDs IS NULL THEN
    SET vTempIDs = '';
  END IF;

  IF LENGTH(vTempIDs) > 0 THEN
    SET vTempIDs = CONCAT(vTempIDs, ',');
    UPDATE TrnWFDetail
    SET DtWFStatus = 11,
        OptTime = CURRENT_TIMESTAMP(),
        OpeDes = CONCAT('Cancel by', inUserID, inMemo),
        UpdateTime = CURRENT_TIMESTAMP()
    WHERE WFStepBasicID = vTargetWFBasicID AND LOCATE(CONCAT(',', CurrentWFStepID, ','), CONCAT(',', vTempIDs)) > 0;
  END IF;

  /**3.2 针对完结步骤标志，处理流程状态 **/
  SELECT
    t.WFStepBasicID INTO vTempID
  FROM (SELECT
      b.WFStepBasicID
    FROM MstWFStep a,
         TrnWFDetail b
    WHERE a.WFStepID = b.CurrentWFStepID AND LOCATE(CONCAT(',', b.WFDetailID, ','), CONCAT(',', vTargetDetails)) > 0
    AND a.FlgEndStep = 1
    GROUP BY b.WFStepBasicID) t LIMIT 1;

  IF vTempID IS NOT NULL THEN
    UPDATE TrnWFStepBasic
    SET DtWFStatus = 1,
        UpdateTime = CURRENT_TIMESTAMP(),
        UpdateBy = inUserID
    WHERE WFStepBasicID = vTempID;

    SELECT
      t.AppTableName,
      t.AppKeyName,
      t.AppKey INTO vTempTableName, vTempKeyName, vTempKeyID
    FROM TrnWFStepBasic t
    WHERE t.WFStepBasicID = vTempID;

    SET @uSQL = ' UPDATE @tablename
    SET DtAppStatus = 1,
        UpdateTime = CURRENT_TIMESTAMP(),
        UpdateBy = @inUserID
    WHERE @tablekey = @keyid';
    SET @uSQL = REPLACE(@uSQL, '@tablename', vTempTableName);
    SET @uSQL = REPLACE(@uSQL, '@tablekey', vTempKeyName);
    SET @uSQL = REPLACE(@uSQL, '@keyid', vTempKeyID);
    SET @uSQL = REPLACE(@uSQL, '@inUserID', inUserID);

    PREPARE stmt FROM @uSQL;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;

  SET outResult = 1;
END
$$

DELIMITER ;USE ivggs_whs;

DELIMITER $$
DROP PROCEDURE IF EXISTS ivggs_whs.procWFUnSubmit$$
CREATE
PROCEDURE ivggs_whs.procWFUnSubmit (IN inObjYMD char(8), IN inWFType int, IN inTableKey int, IN inUserID int, IN inOrgCD varchar(64), IN inPositionID int
, IN inMemo varchar(512), OUT outResult int)
LBL_EXIT:
BEGIN
  /**
  输入参数：	wfType    INT 流程类型；取业务字典FlowType值：1工时；2加班；3休假		
	tableKey  INT 相关表单主键		
	userID    INT 提交用户员工ID		
	orgCD     Char 提交用户当前的组织编码		
	positionID INT 提交用户的职位ID		
	objYMD    Char(6) 表单对象日YYYYMMDD		
	memo      Varchar(512) 说明		
返回参数：	result INT
	1：成功
	-1:当前没有流程定义
	-2：当前存在多个流程定义；
	-100:SQL执行错误；
  **/
  DECLARE vTempCount int;
  DECLARE vWFDetailID int;
  DECLARE vWFStepBasicID int;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION SET outResult = - 100;
  SET outResult = 1;
  SELECT
    COUNT(*) INTO vTempCount
  FROM (SELECT
      f.WFDetailID
    FROM MstWFVersion a,
         MstWFExt b,
         MstWFStep c,
         RtnWFPosition d,
         TrnWFStepBasic e,
         TrnWFDetail f
    WHERE a.WFVersionID = b.WFVersionID AND b.WFExtID = c.WFExtID AND b.WFExtID = d.WFExtID AND c.WFStepID = d.WFStepID
    AND b.DWFType = inWFType AND c.FlgCreateStep = 1 AND d.PositionID = inPositionID AND d.OrgCD = inOrgCD
    AND e.WFStepBasicID = f.WFStepBasicID AND f.CurrentWFStepID = c.WFStepID AND e.DWFType = b.DWFType
    AND e.AppKey = inTableKey AND e.AppTableName = b.TableName AND e.AppKeyName = b.KeyName
    AND e.DtWFStatus = 1 AND e.AppEmID = inUserID AND e.AppEmPositionID = d.PositionID AND e.AppEmOrgCD = d.OrgCD
    AND e.AppEmPositionID = inPositionID AND e.AppEmOrgCD = inOrgCD
    AND f.DtWFStatus = 2 AND e.FlgNew = 1
    AND inObjYMD >= a.DtFrom AND inObjYMD <= a.DtTo
    GROUP BY f.WFDetailID) t;

  IF vTempCount = 0 THEN
    SET outResult = - 1;
    LEAVE LBL_EXIT;
  END IF;

  IF vTempCount > 1 THEN
    SET outResult = - 2;
    LEAVE LBL_EXIT;
  END IF;

  SELECT
    f.WFDetailID,
    MAX(e.WFStepBasicID) INTO vWFDetailID, vWFStepBasicID
  FROM MstWFVersion a,
       MstWFExt b,
       MstWFStep c,
       RtnWFPosition d,
       TrnWFStepBasic e,
       TrnWFDetail f
  WHERE a.WFVersionID = b.WFVersionID AND b.WFExtID = c.WFExtID AND b.WFExtID = d.WFExtID AND c.WFStepID = d.WFStepID
  AND b.DWFType = inWFType AND c.FlgCreateStep = 1 AND d.PositionID = inPositionID AND d.OrgCD = inOrgCD
  AND e.WFStepBasicID = f.WFStepBasicID AND f.CurrentWFStepID = c.WFStepID AND e.DWFType = b.DWFType
  AND e.AppKey = inTableKey AND e.AppTableName = b.TableName AND e.AppKeyName = b.KeyName
  AND e.DtWFStatus = 1 AND e.AppEmID = inUserID AND e.AppEmPositionID = d.PositionID AND e.AppEmOrgCD = d.OrgCD
  AND e.AppEmPositionID = inPositionID AND e.AppEmOrgCD = inOrgCD
  AND f.DtWFStatus = 2 AND e.FlgNew = 1
  AND inObjYMD >= a.DtFrom AND inObjYMD <= a.DtTo
  GROUP BY f.WFDetailID LIMIT 1;

  UPDATE TrnWFDetail t
  SET t.DtWFStatus = 11,
      t.UpdateTime = CURRENT_TIMESTAMP(),
      t.OptID = 0
  WHERE t.WFStepBasicID = vWFStepBasicID;

  UPDATE TrnWFDetail t
  SET t.DtWFStatus = 11,
      t.UpdateTime = CURRENT_TIMESTAMP(),
      t.OptID = inUserID,
      t.OpeDes = inMemo
  WHERE t.WFDetailID = vWFDetailID;

  SET @uSQL = ' UPDATE @tablename
    SET DtAppStatus = 0,
        UpdateTime = CURRENT_TIMESTAMP(),
        UpdateBy = @inUserID
    WHERE @tablekey = @keyid';
  SET @uSQL = REPLACE(@uSQL, '@tablename', vTablename);
  SET @uSQL = REPLACE(@uSQL, '@tablekey', vKeyName);
  SET @uSQL = REPLACE(@uSQL, '@keyid', inTableKey);
  SET @uSQL = REPLACE(@uSQL, '@inUserID', inUserID);

  PREPARE stmt1 FROM @uSQL;
  EXECUTE stmt1;
  DEALLOCATE PREPARE stmt1;
END
$$

DELIMITER ;