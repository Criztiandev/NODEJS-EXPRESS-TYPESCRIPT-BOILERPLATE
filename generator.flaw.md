1. the generator cannot handle the - in the feature name
    example: hearing-schedule
    will be generated as hearing-schedule.service.ts
    but it should be hearingSchedule.service.ts

2. the generator cannot handle two to 3 word feature name
    example: user-management
    will be generated as user-management.service.ts
    but it should be userManagement.service.ts

3. the generator cannot handle the feature name with number
    example: user1-management
    will be generated as user1-management.service.ts

4. In the input for model, the generator cannot handle the relationship
    example: user has many cases
    will be generated as user.model.ts
    but it should be user.model.ts and case.model.ts

5. In the input for model, iits better to do extend for the schema
    example: user has many cases
    will be generated as user.model.ts
    but it should be user.model.ts and case.model.ts

6. In the input for model, the generator cannot handle the relationship
    example: user has many cases
    will be generated as user.model.ts
    but it should be user.model.ts and case.model.ts

7. There is no customization here are the possible prompot
    - npm generate-module --no controller
    - npm generate-module --no service
    - npm generate-module --no route
    - npm generate-module --no model
    - npm generate module --private
    - npm generate module --path=src/feature/auth
    - npm generate module --path=src/feature/auth --private

8. all this repository, service, controller shoudle be extend from the base class
    - repository extend from BaseRepository
    - service extend from BaseService
    - controller extend from BaseController
    - the base class should be in the src/core/base
9. 

