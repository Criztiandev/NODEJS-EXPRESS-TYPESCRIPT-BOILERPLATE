import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../utils/decorator.utils";
import authService from "../service/auth.service";
import cookieUtils from "../../../utils/cookie.utils";

class AuthController {
  @AsyncHandler()
  async register(req: Request, res: Response, next: NextFunction) {
    // #swagger.tags = ['Auth']
    // #swagger.summary = 'Register a new user'
    // #swagger.description = 'Endpoint to register a new user'

    /* #swagger.requestBody = {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['email', 'password'],
                        properties: {
                            email: {
                                type: 'string',
                                format: 'email',
                                description: 'Valid email address'
                            },
                            password: {
                                type: 'string',
                                format: 'password',
                                description: 'User password (min 8 characters)'
                            }
                        }
                    },
                    example: {
                        email: 'user@example.com',
                        password: 'coolestPassword'
                    }
                }
            }
    } */

    /* #swagger.responses[201] = { 
        description: 'User registered successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        payload: {
                            type: 'object',
                            properties: {
                                UID: { type: 'string', description: 'User ID' },
                                role: { type: 'string', description: 'User role' }
                            }
                        },
                        message: { type: 'string' }
                    }
                },
                example: {
                    payload: {
                        UID: '507f1f77bcf86cd799439011',
                        role: 'user'
                    },
                    message: "Registered Successfully"
                }
            }
        }
    } */

    /* #swagger.responses[400] = {
        description: 'Invalid request',
        content: {
            'application/json': {
                example: {
                  error: "Invalid email format",
                },
            }
        }
    } */

    /* #swagger.responses[401] = {
        description: 'Authentication failed',
        content: {
            'application/json': {
                example: {
                  error: "Invalid credentials",
                },
            },
        },
    }
    */

    /* #swagger.responses[500] = {
        description: 'Internal server error',
        content: {
            'application/json': {
                example: {
                  error: "Internal server error",
                },
            }
        }
    } 
    */

    const { body } = req;
    const { userId } = await authService.register(body);

    res.status(201).json({
      payload: {
        UID: userId,
      },
      message: "Registered Successfully",
    });
  }

  @AsyncHandler()
  async login(req: Request, res: Response, next: NextFunction) {
    // #swagger.tags = ['Auth']
    // #swagger.summary = 'Authenticate user and return session tokens'
    // #swagger.description = 'Endpoint to authenticate users using email and password, returns user role and session tokens'

    /* #swagger.requestBody = {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['email', 'password'],
                        properties: {
                            email: {
                                type: 'string',
                                format: 'email',
                                description: 'Valid email address'
                            },
                            password: {
                                type: 'string',
                                format: 'password',
                                description: 'User password (min 8 characters)'
                            }
                        }
                    },
                    example: {
                        email: 'user@example.com',
                        password: 'coolestPassword'
                    }
                }
            }
    } */

    /* #swagger.responses[200] = { 
        description: 'User logged in successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        payload: {
                            type: 'object',
                            properties: {
                                UID: { type: 'string', description: 'User ID' },
                                role: { type: 'string', description: 'User role' }
                            }
                        },
                        message: { type: 'string' }
                    }
                },
                example: {
                    payload: {
                        UID: '507f1f77bcf86cd799439011',
                        role: 'user'
                    },
                    message: 'Login successful'
                }
            }
        }
    } */

    /* #swagger.responses[400] = {
        description: 'Invalid request',
        content: {
            'application/json': {
                example: {
                    error: 'Invalid email format'
                }
            }
        }
    } */

    /* #swagger.responses[401] = {
        description: 'Authentication failed',
        content: {
            'application/json': {
                example: {
                    error: 'Invalid credentials'
                }
            }
        }
    } 
    */

    /* #swagger.responses[500] = {
        description: 'Internal server error',
        content: {
            'application/json': {
                example: {
                    error: 'Internal server error'
                }
            }
        }
    } 
    */

    const { email, password } = req.body;
    const { user, tokens } = await authService.login(email, password);

    // Set session
    req.session.user = user;

    // Set auth cookie
    cookieUtils.setAuthCookie(res, tokens.accessToken);

    res.status(200).json({
      payload: {
        UID: user._id,
        role: user.role,
      },
      message: "Login successful",
    });
  }

  @AsyncHandler()
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    throw new Error("Not implemented");
  }

  /**
   * @swagger
   * /auth/checkpoint/{id}:
   *   post:
   *     summary: Verify account
   *     description: Verify account
   *     responses:
   *       200:
   *         description: Account verified successfully
   */
  @AsyncHandler()
  async verifyAccount(req: Request, res: Response, next: NextFunction) {
    throw new Error("Not implemented");
  }

  /**
   * @swagger
   * /auth/change-password:
   *   post:
   *     summary: Change password
   *     description: Change password
   *     responses:
   *       200:
   *         description: Password changed successfully
   */
  @AsyncHandler()
  async changePassword(req: Request, res: Response, next: NextFunction) {
    const userId = "123123123";
    const { newPassword } = req.body;

    await authService.resetPassword(userId, newPassword);

    res.status(200).json({
      message: "Password changed successfully",
    });
  }
}

export default new AuthController();
