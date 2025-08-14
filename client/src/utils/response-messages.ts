// Response messages for various authentication service actions
export const LoginRes: Record<string, string> = {
  INVALID_CREDENTIALS:
    "No matching racket in the locker room. Double-check your grip and try again.",
  USER_ALREADY_LINKED:
    "This racket is already linked to a 42 or Google account. Try signing in with that one.",
  INVALID_PASSWORD:
    "Wrong swing on the paddle pass. Adjust your grip and give it another go.",
  FST_ERR_VALIDATION:
    "Your credentials need a bit more polish. Check your input and try again.",
  USER_LOGGED_IN: "Welcome back, champ! You’re cleared for the court.",
  TWOFA_REQUIRED:
    "Two-factor authentication required. Let’s finish your warm-up with verification.",
  INTERNAL_SERVER_ERROR:
    "The club’s lights are out at the moment. Try again shortly.",
};

export const RegisterRes: Record<string, string> = {
  UNMATCHED_PASSWORDS:
    "Your passwords don’t match. Steady your stance and re-enter them.",
  PASSWORD_POLICY:
    "Your password needs more training: 8+ characters with upper, lower, number, and a special move.",
  USER_EXISTS: "This racket is already in the club. Try signing in instead.",
  FST_ERR_VALIDATION:
    "Your credentials need a bit more polish. Check your input and try again.",
  USER_REGISTERED: "Welcome aboard! Sign in to unlock your club experience.",
  INTERNAL_SERVER_ERROR:
    "The club’s lights are out at the moment. Try again shortly.",
};

export const LostPasswordRes: Record<string, string> = {
  INVALID_EMAIL:
    "We couldn't find a matching racket with that email. Check your input and try again.",
  USER_LINKED:
    "This racket is already linked to a 42 or Google account. Try signing in with that one.",
  CODE_SENT: "A recovery serve has been sent! Check your inbox for the code.",
  INTERNAL_SERVER_ERROR:
    "The club’s lights are out at the moment. Try again shortly.",
};

export const VerifyCodeRes: Record<string, string> = {
  CODE_NOT_SET:
    "Verification code wasn't set properly. Reset your footing and try again.",
  UNAUTHORIZED:
    "You need to verify your identity first. The court isn’t open to unregistered rackets.",
  OTP_REQUIRED: "OTP required. Enter the code to complete the match.",
  OTP_INVALID:
    "That code doesn’t match our playbook. Double-check and try again.",
  CODE_VERIFIED:
    "OTP verified successfully. Redirecting you to update your password",
  INTERNAL_SERVER_ERROR:
    "The club’s lights are out at the moment. Try again shortly.",
};

export const UpdatePasswordRes: Record<string, string> = {
  USER_LINKED:
    "This racket is already linked to a 42 or Google account. Try signing in with that one.",
  UNMATCHED_PASSWORDS:
    "Your new passwords don’t match. Adjust your swing and re-enter.",
  UNAUTHORIZED:
    "You need a valid password reset link or code to update your password.",
  TOKEN_REQUIRED: "A reset token is required to update your password.",
  USER_LOGGED_IN:
    "Your password has been refreshed. Step back onto the court with confidence.",
  TWOFA_REQUIRED:
    "Two-factor authentication required. Let’s finish the rally with verification.",
  INTERNAL_SERVER_ERROR:
    "The club’s lights are out at the moment. Try again shortly.",
};

export const Setup2FaRes: Record<string, string> = {
  UNAUTHORIZED: "Unauthorized access. Only logged-in champs can set up 2FA.",
  TWOFA_ALREADY_ENABLED:
    "Two-factor authentication is already active on this racket.",
  TWOFA_ALREADY_PENDING:
    "You're already mid-setup. Complete your 2FA to secure the club.",
  SCAN_QR:
    "Scan the QR code with your authenticator app to activate your 2FA defense.",
  CODE_SENT: "A 2FA code has been emailed. Enter it to complete the setup.",
  INTERNAL_SERVER_ERROR:
    "The club’s lights are out at the moment. Try again shortly.",
};

export const Verify2FaRes: Record<string, string> = {
  TWOFA_NOT_SET:
    "Two-factor authentication isn’t set up yet. Prepare your defense first.",
  TWOFA_ALREADY_ENABLED:
    "Two-factor authentication is already active on this racket.",
  TWOFA_NOT_ENABLED: "2FA isn’t active yet. Step onto the setup court first.",
  UNAUTHORIZED: "Unauthorized. Only logged-in champs can verify 2FA.",
  OTP_REQUIRED: "OTP required. Enter your code to proceed.",
  OTP_INVALID: "Invalid OTP. That rally didn’t land — try again.",
  TWOFA_ENABLED:
    "Two-factor authentication successfully enabled. You’ve upgraded your game!",
  USER_LOGGED_IN: "Welcome back, champ! You’re cleared for the court.",
  INTERNAL_SERVER_ERROR:
    "The club’s lights are out at the moment. Try again shortly.",
};

export const Change2FaStateRes: Record<string, string> = {
  UNAUTHORIZED: "Access denied. You must be logged in to disable 2FA.",
  METHOD_NOT_ENABLED:
    "This method is currently disabled. Please enable it first.",
  METHOD_DISABLED: "This 2FA method is now disabled. You can play without it.",
  METHOD_ENABLED: "You're all set — this two-factor method is now active.",
  PRIMARY_METHOD_UPDATED:
    "All set! Your primary 2FA method has been successfully updated.",
  INTERNAL_SERVER_ERROR:
    "The club’s lights are out at the moment. Try again shortly.",
};

export const DeleteAccountRes: Record<string, string> = {
  UNAUTHORIZED: "Unauthorized. Only logged-in champs can delete their account.",
  USER_DATA_DELETED:
    "Your club profile has been retired. We'll miss you on the court!",
  INTERNAL_SERVER_ERROR:
    "The club’s lights are out at the moment. Try again shortly.",
};

export const UpdateCredentialsRes: Record<string, string> = {
  PASSWORDS_REQUIRED:
    "Both your old and new passwords are needed to proceed. Let’s tighten up your defense.",
  INVALID_PASSWORD:
    "Hmm… that old password doesn’t match your past swings. Give it another go.",
  UNMATCHED_PASSWORDS:
    "Your new passwords aren’t syncing. Adjust your aim and try again.",
  SAME_PASSWORD:
    "Your new password is the same as the old one. No need to change it.",
  PASSWORD_POLICY:
    "Your password needs more finesse: at least 8 characters with uppercase, lowercase, a number, and a special shot.",
  EMAIL_EXISTS:
    "That email’s already in the club registry. Try another to secure your spot.",
  UNAUTHORIZED:
    "Hold up, you need to be logged in to adjust your credentials. Back to the lounge login!",
  PASSWORD_UPDATED:
    "Password updated successfully! You’re ready for a fresh round — log in to continue.",
  EMAIL_UPDATED:
    "Email updated. You’re all set — the club has your new contact!",
  TWOFA_REQUIRED:
    "Two-factor authentication required. Let’s wrap this up with a quick verification serve.",
  INTERNAL_SERVER_ERROR:
    "The club’s lights are out at the moment. Try again shortly.",
};

export const VerifyUpdateCredentialsRes: Record<string, string> = {
  NO_PENDING_CREDENTIALS:
    "No pending credentials to update. Please check your request.",
  TWOFA_NOT_SET:
    "Two-factor authentication is not set up. Please set it up before updating credentials.",
  TWOFA_NOT_ENABLED:
    "Two-factor authentication is not enabled. Please enable it before updating credentials.",
  EMAIL_EXISTS:
    "This email is already linked to another account. Please use a different email.",
  UNAUTHORIZED:
    "Unauthorized. You need to be logged in to update your credentials.",
  OTP_REQUIRED:
    "OTP required. Please enter the code sent to your authenticator app or email.",
  OTP_INVALID:
    "That code doesn’t match our playbook. Double-check and try again.",
  PASSWORD_UPDATED:
    "Password locked in — your security game just leveled up. Please sign in again to re-enter the arena.",
  EMAIL_UPDATED:
    "Your email has been updated. The club knows how to reach you now.",
  INTERNAL_SERVER_ERROR:
    "The club’s lights are out at the moment. Try again shortly.",
};

// Response messages for various user profile service actions
export const UpdateUserProfileRes: Record<string, string> = {
  UNAUTHORIZED: "Unauthorized. Only logged-in champs can update their profile.",
  PROFILE_NOT_FOUND: "Profile not found. Please check your request.",
  USERNAME_EXISTS:
    "That name’s already claimed by another club member. Try a fresh one!",
  MISSING_FIELDS: "All fields are required. Please fill them in.",
  FST_ERR_VALIDATION:
    "Your credentials need a bit more polish. Check your input and try again.",
  ZERO_CHANGES: "No tweaks detected. Make a move before saving!",
  PROFILE_UPDATED: "Your profile has been successfully updated.",
  INTERNAL_SERVER_ERROR:
    "The club’s lights are out at the moment. Try again shortly.",
};

export const UploadAvatarRes: Record<string, string> = {
  FILE_REQUIRED: "No avatar selected — please upload your signature look.",
  AVATAR_UPLOADED: "Your avatar has been added. Looking sharp, champ!",
  FILE_TOO_LARGE: "That file is too hefty — please choose a smaller image.",
  UNSUPPORTED_FILE_TYPE:
    "File not up to BHV Club standards — choose a supported format.",
  INTERNAL_SERVER_ERROR:
    "The club’s lights are out at the moment. Try again shortly.",
};

// Response messages for various Relationships service actions
export const FriendRequestRes: Record<string, string> = {
  ADDRESSEE_REQUIRED: "Select a member to send your rally request.",
  ADDRESSEE_INVALID: "We couldn't find that player — double-check the ID.",
  FRIEND_REQUEST_ALREADY_SENT:
    "You've already sent an invitation to this player.",
  FRIEND_REQUEST_SENT: "Rally request sent — awaiting their response.",
  INTERNAL_SERVER_ERROR:
    "The club’s lights are out at the moment. Try again shortly.",
};

export const FriendAcceptRes: Record<string, string> = {
  REQUESTER_REQUIRED:
    "Requester ID is missing — try refreshing your club session.",
  REQUESTER_INVALID: "We couldn't verify the requester — something’s off.",
  FRIEND_REQUEST_ACCEPTED: "You’ve added a new ally to your circle!",
  INTERNAL_SERVER_ERROR:
    "The club’s lights are out at the moment. Try again shortly.",
};

export const FriendRejectRes: Record<string, string> = {
  REQUESTER_REQUIRED: "A requester must be specified to respond.",
  REQUESTER_INVALID: "Invalid request origin — check again.",
  FRIEND_REQUEST_REJECTED: "You’ve kindly declined the invitation.",
  INTERNAL_SERVER_ERROR:
    "The club’s lights are out at the moment. Try again shortly.",
};

export const FriendRemoveRes: Record<string, string> = {
  FRIEND_REQUIRED: "Please specify which member you’d like to remove.",
  FRIEND_INVALID: "We couldn’t identify that member. Try again.",
  FRIEND_REMOVED: "You’ve updated your circle — connection removed.",
  INTERNAL_SERVER_ERROR:
    "The club’s lights are out at the moment. Try again shortly.",
};

export const FriendBlockRes: Record<string, string> = {
  BLOCKED_REQUIRED:
    "Choose the member you'd like to block from your club space.",
  BLOCKED_INVALID: "We couldn’t locate this member. Please try again.",
  BLOCKED_EXISTS: "This player is already on your block list.",
  BLOCK_SUCCESS: "You've blocked this member. The club respects your space.",
  INTERNAL_SERVER_ERROR:
    "The club’s lights are out at the moment. Try again shortly.",
};

export const FriendUnblockRes: Record<string, string> = {
  BLOCKED_REQUIRED: "Specify the member you'd like to welcome back.",
  BLOCKED_INVALID: "Couldn’t verify this player. Please check again.",
  BLOCKED_NOT_FOUND: "This player isn’t currently blocked.",
  UNBLOCK_SUCCESS: "They’re back in the room — member unblocked successfully.",
  INTERNAL_SERVER_ERROR:
    "The club’s lights are out at the moment. Try again shortly.",
};

export const TokenErrorRes: Record<string, string> = {
  TOKEN_REQUIRED: "Authentication token required to continue.",
  TEMP_TOKEN_EXPIRED:
    "Your temporary access token has expired. Please request a new one.",
  TEMP_TOKEN_INVALID:
    "Invalid temporary access token. Please verify and try again.",
  ACCESS_TOKEN_EXPIRED: "Your session has expired. Please log in to continue.",
  ACCESS_TOKEN_INVALID:
    "Invalid access token. Please log in again to refresh your session.",
};
