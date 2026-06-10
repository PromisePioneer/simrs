# DDD Refactoring Plan

## Current Status

### ✅ Complete DDD Domains (10)
- Clinical
- Facility
- IAM
- Inpatient
- MedicalWork
- Outpatient
- Patient
- Pharmacy
- Shared
- Subscriptions
- Tenant

### ⚠️ Incomplete DDD Domains (4)

#### 1. **Accounting** - Missing Domain Layer
- **Status**: Has Application, Infrastructure, Presentation
- **Missing**: Domain (Repositories, Entities, ValueObjects, Services)
- **Files**: 16 files (2 services, 3 models, 2 repositories, 4 controllers)
- **Action**: Create Domain layer with Repository Interfaces

#### 2. **Billing** - Missing Domain Layer
- **Status**: Has Application, Infrastructure, Presentation
- **Missing**: Domain (Repositories, Entities, ValueObjects, Services)
- **Files**: 12 files (3 services, 3 models, 3 controllers, 2 requests, 1 resource)
- **Action**: Create Domain layer with Repository Interfaces

#### 3. **MasterData** - Typo in Folder Name
- **Status**: Has Application, Domain, Infrastructure, Presentation
- **Issue**: Folder named "Persentation" instead of "Presentation" (typo)
- **Files**: 87+ files organized correctly but in wrong folder
- **Action**: Rename "Persentation" → "Presentation"

#### 4. **Payment** - Only Infrastructure (Minimal)
- **Status**: Only has Infrastructure/Listeners
- **Missing**: Application, Domain, Presentation
- **Files**: 1 listener file only
- **Action**: Either fully implement Payment domain OR move to Subscriptions if not needed

## Implementation Order

1. **Fix MasterData typo** (Persentation → Presentation) - Quick win
2. **Create Accounting Domain layer** - Extract repository interfaces
3. **Create Billing Domain layer** - Extract repository interfaces
4. **Review Payment domain** - Decide if needed or consolidate

## DDD Structure Template
```
Domain/
├── Repository/
│   ├── {Entity}RepositoryInterface.php
│   └── ...
├── Entity/
│   └── {Entity}.php
├── ValueObject/
│   └── ...
└── Service/
    └── {DomainService}.php
```
