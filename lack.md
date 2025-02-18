Project Missout and Recommendation

1. There is no update validation for the user

2. generator cant hanndle this 

```
  contactInfo.phone?: string;
  contactInfo.email?: string;
  contactInfo.emergencyContact?: string;
  coordinates.latitude?: number;
  coordinates.longitude?: number;

```

3. Generator cant handle ref to other model
```
// Input

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  barangay: {
    type: Schema.Types.ObjectId,
    ref: "Barangay",
    required: true,
  },

  Result on the validation
 user: z.undefined,
  barangay: z.undefined,

  Model
      user: {
      type: undefined,
      required: true
    },
    barangay: {
      type: undefined,
      required: true
    },

    interface
    user: string;
    barangay: string;

    all of the 3 is affected by this
```


4.  Extra import  when the model is generated
```
```

5.  They cant alos handle array

```

result
    complainants: {
      type: Array,
      required: false,
    },

Input
     status: {
    type: String,
    enum: [
      "filed",
      "underReview",
      "scheduledForHearing",
      "inMediation",
      "resolved",
      "escalated",
      "closed",
    ],
    default: "filed",
  },

  it ignore the enum as well

```

6. 

```
7. The Indentation is not correct its fucked
8. it cant hanndle two words in the generated model
    - case-party X
    - caseParty
9. No customization if the command or flags
10. validation of mongoose is not working
```
  case: z.string().refine((id) => isValidObjectId(id), {
    message: "Invalid case id",
  }),
```
11. there is no findByFilters in the repository, there is no also populate option in the repository

12. MOve the select to the options in the pagination and all find should support population and aggregation


13. Service shoule be like this 

```
import { BaseService } from "../../../core/base/service/base.service";
import { CaseDocument } from "../interface/case.interface";
import CaseRepository from "../repository/case.repository";

class CaseService extends BaseService<CaseDocument> {
  protected readonly repository: typeof CaseRepository;
  constructor(repository: typeof CaseRepository) {
    super(repository);
    this.repository = repository;
  }

  async createItem(payload: Partial<CaseDocument>): Promise<CaseDocument> {
    const generateCaseNumber = await this.generateCaseNumber();

    const item = await this.repository.create(payload);
    return item;
  }

  private async generateCaseNumber(): Promise<string> {
    const totalCases = await this.repository.getTotalCasesCount();
    const caseNumber = `C-${totalCases + 1}`;
    return caseNumber;
  }
}

export default new CaseService(CaseRepository);


not the type is not working


```

14. Add length to the pagination 

15. you forgot the response in the controller

16. validation name is unappropriate

17. Zod validation is broken

18. provide all overided base controller methods or even we dont need the base controller

20. Controller cant handle protected routes

21. Delete on the model is not working


22. cant update or delete once the isDeleted is true


23. Remove the controller base template

24. Model name should include to the error to avoid deleted item not found

25. Im keeping the controller base template for the future reference

25. protected rotue should be protected when extend to the controller

26. in the service there is no getAllItems


27. postman collection is created when generating the module

28. add this to the repository and service
