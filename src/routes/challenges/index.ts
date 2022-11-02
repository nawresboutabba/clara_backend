import * as express from "express";
const router = express.Router();

// router.get(
//   "/challenge/default-configuration",
//   [],
//   async (
//     req: RequestMiddleware,
//     res: ResponseMiddleware,
//     next: NextFunction
//   ) => {
//     try {
//       const challengeController = new ChallengeController();
//       const challengeConfiguration =
//         await challengeController.getChallengeDefaultConfiguration();
//       res.json(challengeConfiguration).status(200).send();
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// router.post(
//   "/challenge/default-configuration",
//   [
//     authentication,
//     acl(RULES.IS_LEADER),
//     check("", "challenge configuration already exist").custom(
//       async (): Promise<void> => {
//         const currentConfiguration =
//           await ConfigurationService.getConfigurationDefault(
//             RESOURCE.CHALLENGE
//           );
//         if (currentConfiguration) {
//           return Promise.reject();
//         }
//         return Promise.resolve();
//       }
//     ),
//     body("can_show_disagreement").isBoolean(),
//     body("disagreement_default").isBoolean(),
//     body("can_fix_desapproved_idea").isBoolean(),
//     body("can_choose_scope").isBoolean(),
//     body("is_private_default").isBoolean(),
//     body("can_choose_WSALevel").isBoolean(),
//     check("WSALevel_available", "WSALevel_available invalid").custom(
//       async (value: string[]): Promise<void> => {
//         const WSALevel: string[] = _.sortedUniq(value);
//         WSALevel.forEach((value) => {
//           if (![WSALEVEL.COMPANY, WSALEVEL.AREA].includes(value)) {
//             return Promise.reject();
//           }
//         });
//         return Promise.resolve();
//       }
//     ),
//     body("WSALevel_default").isIn([WSALEVEL.COMPANY, WSALEVEL.AREA]),
//     body("community_can_see_reactions").isBoolean(),
//     body("maximun_dont_understand").isInt({ min: 0 }),
//     body("minimun_likes").isInt({ min: 0 }),
//     body("reaction_filter").isBoolean(),
//     body("external_contribution_available_for_generators").isBoolean(),
//     body("external_contribution_available_for_committee").isBoolean(),
//     body(
//       "participation_mode_available",
//       "participation_mode_available invalid"
//     ).custom(async (value: string[]): Promise<void> => {
//       const participationModeAvailable: string[] = _.sortedUniq(value);
//       participationModeAvailable.forEach((value) => {
//         if (
//           ![
//             PARTICIPATION_MODE.TEAM,
//             PARTICIPATION_MODE.INDIVIDUAL_WITH_COAUTHORSHIP,
//           ].includes(value)
//         ) {
//           return Promise.reject();
//         }
//       });
//       return Promise.resolve();
//     }),
//     body("time_in_park").isInt(),
//     body("time_expert_feedback").isInt(),
//     body("time_idea_fix").isInt(),
//   ],
//   async (
//     req: RequestMiddleware,
//     res: ResponseMiddleware,
//     next: NextFunction
//   ) => {
//     try {
//       await throwSanitizatorErrors(
//         validationResult,
//         req,
//         ERRORS.ROUTING.CHALLENGE_CONFIGURATION
//       );

//       const challengeController = new ChallengeController();
//       const challengeConfiguration =
//         await challengeController.setChallengeDefaultConfiguration(req.body);
//       res.json(challengeConfiguration).status(200).send();
//     } catch (error) {
//       next(error);
//     }
//   }
// );
/*
router.get(URLS.CHALLENGE.CHALLENGE_PROPOSE, [
  authentication,
  acl(RULES.IS_COMMITTE_MEMBER)
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {

    const query: QueryChallengeForm = await formatChallengeQuery(req.query)
    const challengeController = new ChallengeController()
    const challenge = await challengeController.listChallengeProposal(query)
    res
      .json(challenge)
      .status(200)
      .send()
  } catch (error) {
    next(error)
  }
})
*/
// router.get(
//   URLS.CHALLENGE.CHALLENGE_PROPOSE_PROPOSEID,
//   [authentication, acl(RULES.IS_COMMITTE_MEMBER)],
//   (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
//     try {
//       const challengeController = new ChallengeController();
//       const proposal = challengeController.getChallengeProposal(
//         req.params.proposeId
//       );
//       res.json(proposal).status(200).send();
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// router.post(
//   [
//     // URLS.CHALLENGE.CHALLENGE,
//     URLS.CHALLENGE.CHALLENGE_PROPOSE,
//   ],
//   [
//     authentication,
//     acl(RULES.CAN_INSERT_CHALLENGE_OR_CHALLENGE_PROPOSAL),
//     body("type").isIn([CHALLENGE_TYPE.GENERIC, CHALLENGE_TYPE.PARTICULAR]),
//     /**
//      * Just can exist one generic challenge
//      */
//     body("type").custom(async (value): Promise<void> => {
//       try {
//         if (CHALLENGE_TYPE.PARTICULAR == value) {
//           return Promise.resolve();
//         }
//         const genericChallenge = await ChallengeService.getGenericChallenge();

//         if (genericChallenge) {
//           return Promise.reject("generic challenge that exist");
//         }
//         return Promise.resolve();
//       } catch (error) {
//         return Promise.reject("generic challenge that exist");
//       }
//     }),
//     body("title", VALIDATIONS_MESSAGE_ERROR.SOLUTION.TITLE_EMPTY).notEmpty(),
//     body(
//       "description",
//       VALIDATIONS_MESSAGE_ERROR.SOLUTION.DESCRIPTION_EMPTY
//     ).notEmpty(),
//     body("images", "images does not valid").isArray(),
//     body("department_affected").isArray(),
//     body("department_affected").custom(
//       async (value: string[], { req }): Promise<void> => {
//         try {
//           const departmentAffected = await AreaService.getAreasById(value);
//           if (departmentAffected.length == value.length) {
//             req.utils = departmentAffected;
//             return Promise.resolve();
//           }
//           return Promise.reject("department_affected does not valid");
//         } catch (error) {
//           return Promise.reject("department_affected does not valid");
//         }
//       }
//     ),
//     body("tags").isArray(),
//     body("tags").custom(async (value: string[], { req }): Promise<void> => {
//       try {
//         const query = {
//           tagId: { $in: value },
//           type: TAG_ORIGIN.CHALLENGE,
//         };
//         const tags = await Tag.find(query);
//         if (tags.length == value.length) {
//           req.utils = { tags, ...req.utils };
//           return Promise.resolve();
//         }
//         return Promise.reject("tags does not valid");
//       } catch (error) {
//         return Promise.reject("tags does not valid");
//       }
//     }),
//     body("group_validator").custom((value: string, { req }): Promise<void> => {
//       try {
//         const groupValidator =
//           GroupValidatorService.getGroupValidatorById(value);
//         if (groupValidator) {
//           req.utils = { groupValidator, ...req.utils };
//           return Promise.resolve();
//         }
//         return Promise.reject("Group Validator that not exist");
//       } catch (error) {
//         return Promise.reject("Group Validator that not exist");
//       }
//     }),
//     body("is_strategic", "is_strategic invalid")
//       .notEmpty()
//       .escape()
//       .isIn([true, false]),
//     body("finalization").notEmpty(),
//     /**
//      * Check that finalization date is in the future
//      */
//     body("finalization").custom((value: Date): Promise<void> => {
//       try {
//         const currentDate = toISOData(getCurrentDate());
//         const finalizationData = toISOData(value);

//         if (finalizationData > currentDate) {
//           return Promise.resolve();
//         }
//         return Promise.reject(
//           "Date does not valid. Finalization must be greater than current date"
//         );
//       } catch (error) {
//         return Promise.reject(
//           "Date does not valid. Finalization must be greater than current date"
//         );
//       }
//     }),
//     /**
//      * Checking the configuration of allowed solutions.
//      */
//     body("can_show_disagreement", "can_show_disagreement invalid")
//       .notEmpty()
//       .escape()
//       .isIn([true, false]),
//     body("can_fix_disapproved_idea", "can_fix_disapproved_idea invalid")
//       .notEmpty()
//       .escape()
//       .isIn([true, false]),

//     body("can_choose_scope", "can_choose_scope invalid")
//       .notEmpty()
//       .escape()
//       .isIn([true, false]),
//     body("is_privated", "is_privated invalid")
//       .notEmpty()
//       .escape()
//       .isIn([true, false]),

//     body("can_choose_WSALevel", "can_choose_WSALevel invalid")
//       .notEmpty()
//       .escape()
//       .isIn([true, false]),
//     body("WSALevel_available").notEmpty(),
//     body("WSALevel_available", "WSALevel_available invalid").custom(
//       (value: string[], { req }): Promise<void> => {
//         try {
//           const WSALevel: string[] = _.sortedUniq(value);
//           WSALevel.forEach((value) => {
//             if (![WSALEVEL.COMPANY, WSALEVEL.AREA].includes(value)) {
//               return Promise.reject("WSALevel_available invalid");
//             }
//           });
//           return Promise.resolve();
//         } catch (error) {
//           return Promise.reject("WSALevel_available invalid");
//         }
//       }
//     ),
//     body("WSALevel_chosed", "WSALevel_chosed invalid").isIn([
//       WSALEVEL.COMPANY,
//       WSALEVEL.AREA,
//     ]),

//     body("areas_available", "areas_available invalid").custom(
//       async (value: string[], { req }): Promise<void> => {
//         if (req.body.WSALevel_chosed == WSALEVEL.AREA) {
//           const areasAvailable = await AreaService.getAreasById(
//             _.sortedUniq(value)
//           );

//           if (areasAvailable.length > 0) {
//             req.utils = areasAvailable;
//             return Promise.resolve();
//           } else {
//             return Promise.reject(
//               "areas_available can not be empty when WSALevel_chosed = AREA"
//             );
//           }
//         }
//         return Promise.resolve();
//       }
//     ),
//     body("community_can_see_reactions", "community_can_see_reactions invalid")
//       .notEmpty()
//       .escape()
//       .isIn([true, false]),
//     body("minimun_likes", "minimun_likes invalid").notEmpty().escape().isInt(),
//     body("maximum_dont_understand", "maximum_dont_understand invalid")
//       .notEmpty()
//       .escape()
//       .isInt(),
//     body("reaction_filter", "reaction_filter invalid")
//       .notEmpty()
//       .escape()
//       .isIn([true, false]),
//     body("participation_mode_available").custom(
//       (value: Array<string>, { req }): Promise<void> => {
//         return new Promise((resolve, reject) => {
//           value.forEach((element) => {
//             if (
//               [
//                 PARTICIPATION_MODE.TEAM,
//                 PARTICIPATION_MODE.INDIVIDUAL_WITH_COAUTHORSHIP,
//               ].includes(element) == false
//             ) {
//               return reject("participation_mode_available invalid");
//             }
//           });
//           if (value.length < 3) {
//             return resolve();
//           }
//           return reject("participation_mode_available invalid");
//         });
//       }
//     ),
//     body(
//       "participation_mode_chosed",
//       "participation_mode_chosed invalid"
//     ).custom((value: string, { req }): Promise<void> => {
//       return new Promise((resolve, reject) => {
//         if (req.body.participation_mode_available.includes(value)) {
//           return resolve();
//         }
//         return reject("participation_mode_chosed invalid");
//       });
//     }),
//     body("time_in_park", "time_in_park invalid").notEmpty().escape().isInt(),
//     body("time_expert_feedback", "time_expert_feedback invalid")
//       .notEmpty()
//       .escape()
//       .isInt(),
//     body("time_idea_fix", "time_idea_fix invalid").notEmpty().escape().isInt(),
//     body(
//       "external_contribution_available_for_generators",
//       "external_contribution_available_for_generators invalid"
//     )
//       .notEmpty()
//       .escape()
//       .isIn([true, false]),
//     body(
//       "external_contribution_available_for_committee",
//       "external_contribution_available_for_committee invalid"
//     )
//       .notEmpty()
//       .escape()
//       .isIn([true, false]),
//   ],
//   async (
//     req: RequestMiddleware,
//     res: ResponseMiddleware,
//     next: NextFunction
//   ) => {
//     try {
//       await throwSanitizatorErrors(
//         validationResult,
//         req,
//         ERRORS.ROUTING.ADD_CHALLENGE
//       );

//       // const challengeController = new ChallengeController();
//       // if (req.url == URLS.CHALLENGE.CHALLENGE) {
//       //   const challenge = await challengeController.newChallenge(req.body, req.user, req.utils)
//       //   res
//       //     .status(200)
//       //     .json(challenge)
//       //     .send();
//       // } else if (req.url == URLS.CHALLENGE.CHALLENGE_PROPOSE) {
//       //   const challenge = await challengeController.newChallengeProposal(req.body, req.user, req.utils)

//       //   res
//       //     .status(200)
//       //     .json(challenge)
//       //     .send();
//       // }
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// router.post(
//   URLS.CHALLENGE.CHALLENGE_PROPOSE_PROPOSEID_ACCEPT,
//   [authentication, acl(RULES.IS_LEADER)],
//   async (
//     req: RequestMiddleware,
//     res: ResponseMiddleware,
//     next: NextFunction
//   ) => {
//     try {
//       const challengeController = new ChallengeController();
//       const challenge = await challengeController.acceptChallengeProposal(
//         req.params.proposeId
//       );
//       res.status(200).json(challenge).send();
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// router.post(
//   URLS.CHALLENGE.CHALLENGE_CHALLENGEID_SOLUTION,
//   [authentication, acl(RULES.CAN_VIEW_CHALLENGE)],
//   async (
//     req: RequestMiddleware,
//     res: ResponseMiddleware,
//     next: NextFunction
//   ) => {
//     try {
//       await throwSanitizatorErrors(
//         validationResult,
//         req,
//         ERRORS.ROUTING.ADD_SOLUTION
//       );
//       const challengeController = new ChallengeController();
//       const solution = await challengeController.newSolution(
//         req.user,
//         req.utils,
//         req.resources.challenge
//       );
//       res.status(200).json(solution).send();
//       next();
//     } catch (e) {
//       next(e);
//     }
//   }
// );

// router.post('/challenge/:challengeId/reaction', [
//   authentication,
//   acl(
//     RULES.CAN_VIEW_CHALLENGE
//   )
// ], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
//   try {
//     const challengeController = new ChallengeController()
//     const resp = await challengeController.newReaction(req.params.challengeId, req.body, req.user)
//     res
//       .json(resp)
//       .status(200)
//       .send()
//   } catch (error) {
//     next(error)
//   }
// })

const challengeRouter = router;
export default challengeRouter;
