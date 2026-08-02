# Booking confirmation setup

The current live form continues to use FormSubmit until this setup is complete. Do not change the website form action yet.

## What this automation does

- records each booking in a private Google Sheet;
- sends the customer a branded confirmation containing their submitted details;
- emails the complete booking to `bdwindowservices@gmail.com`;
- creates a booking reference;
- accepts several bookings in the same arrival window;
- returns the customer to the website after a successful submission.

It does not check availability or limit the number of bookings in a time window.

## 1. Create the spreadsheet

1. Sign in to the Google account for `bdwindowservices@gmail.com`.
2. Go to Google Sheets and create a blank spreadsheet.
3. Name it `B D Website Bookings`.
4. Keep the spreadsheet private. The script creates and formats the `Bookings` tab automatically after the first booking.

## 2. Add the Apps Script files

1. In the spreadsheet, select **Extensions > Apps Script**.
2. Set the Apps Script project name to `B D Booking Confirmation`.
3. Open the existing `Code.gs` file and replace its contents with the contents of this folder's `Code.gs`.
4. Select the **+** beside Files, choose **HTML**, and name the new file `EmailTemplate`.
5. Replace the new file's contents with the contents of `EmailTemplate.html`.
6. Select **Project Settings** and set the time zone to **(GMT+00:00) London** or **Europe/London**.
7. Save the project.

## 3. Deploy the web application

1. Select **Deploy > New deployment**.
2. Select the gear icon and choose **Web app**.
3. Description: `Website booking confirmations`.
4. Execute as: **Me**.
5. Who has access: **Anyone**.
6. Select **Deploy**.
7. Google will ask you to authorise access to the spreadsheet and Gmail. Review the permissions and approve them while signed in as `bdwindowservices@gmail.com`.
8. Copy the web app URL ending in `/exec` and keep it private until it is added to the website form.

If Google shows an unverified-app message for this personal script, choose **Advanced**, open the `B D Booking Confirmation` project, review the requested permissions, and continue only while signed in to the correct business account.

## 4. Hand-off for website connection

Send the `/exec` web app URL to the website maintainer. The maintainer will then:

1. replace the FormSubmit form destination on the feature branch;
2. remove FormSubmit-only hidden fields;
3. update the on-page success wording to say the booking is confirmed;
4. submit controlled test bookings;
5. check the Sheet, business notification and customer confirmation;
6. merge the pull request only after the complete journey passes.

## Testing checklist

- Use a separate customer email address for the first test.
- Confirm one new row appears in the `Bookings` sheet.
- Confirm the customer email shows the correct name, address, estimate and arrival window.
- Confirm the business notification arrives at `bdwindowservices@gmail.com`.
- Reply to the customer confirmation and verify the reply goes to the business inbox.
- Check the customer email on a phone as well as a computer.
- Check the spam folder during testing.

Google applies daily sending limits to Gmail and Apps Script. This setup is intended for normal small-business booking volume; the script will show an error page instead of claiming success if storing the booking or sending the emails fails.
