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
