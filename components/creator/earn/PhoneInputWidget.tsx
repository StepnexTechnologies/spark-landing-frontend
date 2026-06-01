"use client";

// Bundles react-phone-number-input together with its ~5 KiB stylesheet so BOTH
// load only when the phone field is actually rendered. ValidatedPhoneInput
// pulls this in via next/dynamic(ssr:false), which keeps the widget CSS off the
// route's render-blocking critical path — the field is interaction-only, so
// there's no reason for its stylesheet to delay first paint. The minimal flex
// layout the pre-mount placeholder needs lives in globals.css, so deferring
// this sheet introduces no layout shift.
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default PhoneInput;
