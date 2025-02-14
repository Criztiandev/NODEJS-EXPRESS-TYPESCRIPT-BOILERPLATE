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

5. 

