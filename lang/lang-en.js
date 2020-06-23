(function (window) {
  /**
   * {virtualclass1} {virtualclass2} are elements you passes with getString function eg:-
   *   virtualclass.lang.getString('operaBrowserIssue', ['opeara', 27]);
   *   opera and 27 will be replaced over the {virtualclass1} and {virtualclass2} resepectively for particular line of language file.
   * @type type
   */
  const message = {
    ActiveAll: 'Active all',
    addcontext: 'Add bookmark',
    Addoption: 'Add option',
    addnew: 'Add new',
    adminusr: 'Admin user',
    appPrerequites: 'Validate system requirements',
    assign: 'Assign',
    assignDisable: 'Reclaim controls',
    askplayMessage: '<span id="askplaymsg"> Should we start playing the session?</span><br /><span id="remaingmsg">Remaining data will be downloaded in the background.</span>',
    askplaymsg: '<span id="askplaymsg"> "Downloading in progress, click Play to begin </span>"',
    audioInput: 'Audio input',
    audiolatency: 'Audio latency',
    audioOutput: 'Audio output',
    audioDisable: 'Unmute',
    audioEnable: 'Mute',
    addQuestion: 'Add question',
    addContext: 'Add Bookmark',
    answer: 'Answers',
    action: 'Actions',
    audioTest: 'Your voice will be recorded and played back to you. \n Press Ok and speak something for few seconds.',
    Back: 'Back',
    vote: 'Vote',
    bandfast: 'Optimum network connectivity',
    bandmedium: 'Slow network connectivity',
    bandslow: 'Network connectivity failure',
    bandwitdhImageNotFound: 'Image downloading failed, please click "Next" button to continue.',
    becomeTeacher: 'Become teacher',
    Binary_Limit_Exeed: 'Warning: High BN usage',
    bulkUserActions: 'Bulk user actions',
    ByInstructor: 'By instructor',
    ByTimer: 'By timer',
    cancel: 'Cancel',
    canvasDrawMsg: 'You can click on any tool for drawing' + 'click and hold the left mouse button to draw',
    canvasmissing: 'Canvas is missing in your browser. Please update your browser to the latest version.',
    chatEnable: 'Disable chat',
    Chatroom: 'Chatroom',
    Circle: 'Circle',
    ClearAll: 'Clear all',
    clickheretoplay: 'Click Here To Play',
    clicktoplay: 'Play',
    chatDisable: 'Enable chat',
    chFireBrowsersIssue: 'Your browser {virtualclass1} {virtualclass2} needs updation, Congrea support Chrome 40+ and Firefox 35+.',
    clearAllWarnMessageW: 'Do you really want to clear this whiteboard?',
    clearAllWarnMessageD: 'Do you really want to clear this drawings?',
    closedsDbheading: 'Close document dashboard',
    closeSharePresentationdbHeading: 'Close presentation dashboard',
    closevideoDashboard: 'Close video dashboard',
    closeVoting: 'Close voting',
    cnmissing: 'Chunk number is missing',
    CodeEditor: 'Code editor',
    cof: 'Connection off',
    collaborate: 'Collaborate',
    commonChat: 'Common chat',
    commonBrowserIssue: 'Your browser {virtualclass1} {virtualclass2} is not supported, Use latest version of Chrome and Firefox.',
    congreainchrome: 'Your browser is compatible.',
    confirmCancel: 'No',
    confirmOk: 'Yes',
    connectionClose: 'Connection is closed ({virtualclass1}).',
    Controls: 'Controls',
    coursePoll: 'Course level poll',
    Cpoll: 'Course poll',
    Cquiz: 'Close quiz',
    createnewpoll: 'Create new poll',
    Creator: 'Creator',
    comment: 'Comments',
    dap: 'false',
    delete: 'Delete',
    delblank: 'Remove the blank option',
    Delete: 'Delete',
    DevicesNotFoundError: 'Webcam is not available, or not connected properly.',
    deletepopup: 'Are you sure to delete ?',
    disable: 'Disable',
    disabled: 'disabled',
    disableAllVideo: 'Disable all video',
    dltDisabled: 'Can be deleted  by creator of the poll',
    documentShare: 'Share document',
    DocumentSharing: 'Document sharing',
    DocumentSharedbHeading: 'Document dashboard',
    docUploadSuccess: 'Document uploaded successfully',
    download: 'Download',
    downloadFile: 'Download file',
    downloadsession: 'Please wait while the recording is downloaded',
    drawArea: 'Draw area',
    dropfilehere: 'Drop files here',
    duplicateUploadMsg: 'This file already exists, please upload new file.',
    edit: 'Edit',
    editorCode: 'Code editor',
    edittitle: 'Edit title',
    editorRichDisable: 'Write mode',
    editorRichEnable: 'Read only',
    educator: 'Educator',
    EHTMLPresentUrl: 'Enter HTML5 presentation URL',
    enable: 'Enable',
    enablehistory: '"Browser history" should be enabled during the session.',
    enableAllVideo: 'Enable all video',
    enteryouryoutubeurl: 'Enter YouTube/online video URL',
    etDisabledA: 'Can’t edit, poll attempted',
    etDisabledCr: 'Can be edited by creator of the poll',
    ETime: 'Elapsed time',
    TimeRemaining: 'Time remaining',
    QuestionsOverview: 'Questions overview',
    UsersAttempted: 'Users attempted',
    gRname: 'Name',
    gRtimeTaken: 'Time taken',
    gRgrade: 'Grade',
    gRQAttempted: 'Q. attempted',
    gRCorrect: 'Correct',
    FF2: 'Fast forward 2',
    FF8: 'Fast forward 8',
    filenotsave: 'Your file could not be saved.',
    filetsaveTS: 'The session is ready to save.',
    Finish: 'Finish',
    fitToPage: 'Fit to page',
    fitToScreen: 'Fit to screen',
    Freehand: 'Free hand',
    general: 'General',
    Greport: 'Grade report',
    highBandWidthSpeed: 'Your bandwidth is good enough.',
    httpsmissing: 'Only secure origins(https) are allowed for screen sharing.',
    ieBrowserIssue: 'Internet Explorer is not supported, Congrea fully support Chrome  and Firefox.',
    ios7support: 'For Apple, Virtual Class supports iOS 8 and higher versions.',
    iosAudEnable: 'Tap here to enable the audio',
    InternalError: 'Please ensure that same webcam is not being used <br /> in multiple browsers or multiple applications. ',
    invalidcmid: 'Invalid course module Id.',
    invalidurl: 'Invalid URL',
    indvprogress: 'Current task',
    InsertimageURL: 'Insert image URL',
    JoinClassMsg: 'Join ClassRoom',
    JoinSession: 'Join session',
    keymissing: 'Your software(LMS/CMS)\'s key is is missing',
    Line: 'Line',
    lowBandWidthSpeed: 'Your bandwidth is too low, we are stopping video playback. You will still be able to hear audio and view screen.',
    maxCommonChat: 'Show chat window',
    Max_rooms: 'Error: Max rooms limit reached',
    Max_users: 'Error: Max users limit reached',
    media: 'Media',
    mediumBandWidthSpeed: 'Your bandwidth is limited, we are reducing video quality based on your available bandwidth.',
    minCommonChat: 'Hide chat window',
    minoption: 'Enter at least two options',
    microphoneNotConnected: 'Microphone is not available, or not connected properly',
    // 'mictesting' : 'If above audio bar fluctuate while you speak, microphone is working.',
    mictesting: 'Microphone is working, if above audio bar fluctuates <br />'
    + 'and you are able to hear your own voice, while you speak',
    minute: 'Minute',
    ModeclosingPoll: 'Mode of closing Poll :',
    msgForDownloadStart: 'Unable to save data. <br /> Preparing data for download',
    msgForReload: 'Please reload this page to continue editing.',
    msgForWhiteboard: 'Empty whiteboard.',
    msgStudentForReload: 'Please reload this page.',
    Multiple_login: 'Error: Access denied, multiple logins',
    muteAll: 'Mute all',
    muteAllAudio: 'Mute all audio',
    mybsharedoc: 'Document will shared shortly',
    NAME: 'NAME',
    Next: 'Next',
    note: 'Add note',
    notePlaceholder: 'Write your note here',
    page: 'Page',
    of: 'of',
    typeQuestion: 'Type question',
    typeOption: 'Type option',
    dropVideosHere: 'Drop videos here',
    nomdlroot: 'There is no url for momodle root.',
    normalView: 'Normal view',
    noResultStd: 'You are not permitted to see the result',
    NotAllowedError: 'Webcam is disabled',
    NotFoundError: 'Webcam is not available, or not connected properly.',
    NotReadableError: 'Please ensure that same webcam is not being used <br /> in multiple browsers or multiple applications.',
    notsupportbrowser: '{virtualclass1} is not fully compatible. For the best experience, use Google Chrome.',
    NotSupportedError: 'Only secure origins(https) are allowed for audio and video',
    notSupportIphone: "Sorry. Virtual class doesn't support mobile phones.",
    noPoll: 'There is no question available for poll. Go to ‘Add new’ to create question.',
    noPollNoAdmin: 'There is no question available for site poll .Only admin can create site level poll.',
    noQuiz: `There is no Quiz available. Add quiz from your Moodle.
    Congrea Supports only multiple choice questions.`,
    Novote: 'No vote received for this poll',
    nowebcam: 'Webcam is not available, or not connected properly.',
    nowebcamconnectedyet: 'Congrea does not receives any user input yet.',
    notcompatiblecpu: 'Processing power (CPU) in this system is low. <br /> We recommend working with modern CPU.',
    notcompatibleram: 'RAM in this system is low. <br /> We recommend 4GB of RAM.',
    offcollaboration: 'Collaboration off',
    oncollaboration: 'Collaboration on',
    opendsDbheading: 'Document dashboard',
    openSharePresentationdbHeading: 'Presentation dashboard',
    openvideoDashboard: 'Video dashboard',
    operaBrowserIssue: 'Your browser {virtualclass1} {virtualclass2} is partially supported. You will not be able to share your screen, Congrea fully support chrome and Firefox',
    Options: 'Options',
    optselectd: 'OPTION SELECTED',
    Oval: 'Oval',
    overallprogress: 'Overall progress',
    Pause: 'Pause',
    pclosetag: '<span>Are you sure to close this poll?  </span>',
    pclose: 'Are you sure to close voting?',
    Pclosed: 'Poll closed',
    pdfnotrender: 'There is problem with loading window, please reload browser.',
    Pdsuccess: 'Poll deleted successfully',
    PEdit: 'Poll edit',
    PermissionDeniedError: 'Webcam access has been denied.',
    PERMISSION_DENIED: 'You denied access to your Webcam(camera/microphone).',
    Play: 'Play',
    playsessionmsg: 'Click ‘play’ to start the session.',
    pleasewaitWhSynNewCont: 'Please wait a while. Syncing new content.',
    plswaitwhile: 'Please wait....',
    poll: 'Poll',
    pollblank: 'Question can not be left blank',
    pollCancel: 'Close',
    pollDel: 'Are you sure to delete this poll?',
    pollHead: 'Vote this poll',
    pollmaybeshown: 'Poll will be published',
    pollmybpublish: 'Poll will be published shortly',
    pollresult: 'Previous result',
    ppoll: 'Publish poll',
    PQuestions: 'Poll questions',
    PQuiz: 'Publish quiz',
    Precheck: 'Precheck',
    precheckStart: 'Pre-check',
    prechkcmplt: 'Precheck complete',
    Presult: 'Poll result',
    preWllBshortly: 'Presentation will be shared shortly',
    Prev: 'Prev',
    proposedspeed: 'Proposed speed',
    PSetting: 'Poll setting',
    Publish: 'Publish',
    QClosed: 'Quiz closed',
    Question: 'Question',
    QTquestions: 'Total no of questions',
    QMaximumMark: 'Maximum mark',
    QCorrectAnswers: 'Correct answers',
    QQuestionsAttempted: 'Questions attempted',
    QYouScored: 'You Scored',
    Quiz: 'Quiz',
    'Quiz/page': 'Quiz / page',
    Quizes: 'Quizzes',
    quizSubmit: 'Submit',
    quizmayshow: 'Get ready for a quiz',
    quizreviewpublish: 'Review & publish quiz',
    RaiseHandStdDisabled: 'Undo raise hand',
    RaiseHandEnable: 'Hand raised',
    raiseHandNotify: 'Student(s) raised hand',
    RaiseHandStdEnabled: 'Raise hand',
    readonlymode: 'Read only',
    receivedVotes: 'Received votes',
    reclaim: 'Reclaim',
    Rectangle: 'Rectangle',
    rejected: 'Another application on your computer might be using your webcam. Kindly close all other applications',
    reload: 'Reload',
    reloadDoc: 'Reload document',
    removeContext: 'Remove Bookmark',
    replay: 'Re-play',
    Replay: 'Replay from start.',
    replay_message: 'Thanks for watching.',
    requestScreenShare: 'Request screen share',
    requestedScreenShare: 'Screen share is requested',
    Reset: 'Reset',
    Rtime: 'Remaining time',
    rusureCquiz: '<span>Are you sure to close this quiz? </span>',
    rvtu: 'Votes received/ total users',
    reply: 'Reply',
    safariBrowserIssue: 'Your browser Safari {virtualclass1} is not supported, We fully support Chrome  and Firefox',
    Save: 'Save',
    savesession: 'Do you want to save current session?',
    savesessionTechSupport: "Do you want to save current session? <br /> Once you download the session, Updates won't be available on re-downloading of same session.",
    screensharealready: 'The screen is being shared.',
    ScreenShare: 'Screen share',
    screensharemsg: 'The above screen is being shared.',
    screensharenotsupport: 'Screen share is not supported',
    screensharedenied: 'User denied to share screen',
    second: 'Second',
    selfview: 'Disable public view',
    SetTimer: 'Set timer',
    sesseionkeymissing: 'Session key is missing from Front End.', // from javascript
    sentPackets: 'Sent <br/><span>Packets</span>',
    // 'sessionend': "Close session.",
    SessionEnd: 'Session end',
    sessionexpired: 'Session Expired',
    sessionendmsg: 'Session has been closed. You may now close your browser.',
    setting: 'Setting',
    Searchuser: 'Search user',
    sendMessage: 'Send Message',
    share: 'Share',
    ShareVideo: 'Share video',
    shareAnotherYouTubeVideo: 'Share another YouTube video',
    SharePresentation: 'Share presentation',
    SharePresentationdbHeading: 'Presentation dashboard',
    sharetoall: 'Enable public view',
    Showresulttostudents: 'Show result to students',
    sitePoll: 'Site level poll',
    Skip: 'Close',
    someproblem: 'There is some problem in uploading file. Please try again.',
    SourceUnavailableError: 'Please ensure that same webcam is not being used in multiple browsers or multiple applications.',
    // 'SourceUnavailableError' : 'Another application on your computer might be using your webcam. Kindly close all other applications that might be using your webcam.',
    speakerTest: 'If you can hear music, speakers are working.',
    Spoll: 'Site poll',
    ssBtn: 'Stop sharing',
    ssStop: 'Stop screen sharing',
    startnewsession: 'Do you really want to end this session?',
    status: 'Status',
    stdPublish: 'stdPublish',
    stdscreenshare: 'Do you want to share your screen ?',
    studentAudEnable: 'Student audio enabled',
    studentSafariBrowserIssue: 'Your browser {virtualclass1} {virtualclass2} cannot  share your webcam with other users, Congrea fully support Chrome  and Firefox.',
    supportDesktop: 'Virtual Class does not support tablets or mobiles. To present please use a desktop.',
    supportDesktopOnly: 'Sorry, presenter mode only supports desktops. Tablets and Mobile devices are not supported.',
    teacherSafariBrowserIssue: 'Safari does not support presenter functionality. Please switch to Chrome or Firefox.',
    techsupport: 'Tech support',
    testingbrowser: 'Testing browser compatibility',
    testinginternetspeed: 'Testing internet speed',
    testingmichrophone: 'Testing microphone',
    testingspeaker: 'Testing speaker',
    testingwebcam: 'Testing webcam',
    Text: 'Text',
    Text_Limit_Exeed: 'Warning: High TX usage',
    TextEditor: 'Text editor',
    textPlaceholder: 'Enter text here',
    Time: 'Time',
    Tmyclose: 'Teacher may close this poll at any time',
    total: 'Total',
    totalprogress: 'Total progress',
    tpAudioTest: 'Test audio',
    transferControls: 'Transfer controls',
    Triangle: 'Triangle',
    Udocument: 'Upload document',
    Unauthenticated: 'Error: Access invalid',
    unmuteAll: 'Unmute all',
    uploadsession: 'Please wait until processing is complete',
    uploadvideo: 'Upload video',
    uploadedsession: 'Your session has ended. You may now close the window '
    + ' or close this popup to start a new session.',
    usermissing: 'User is missing',
    userList: "User's list",
    upvote: 'Upvote',
    instructorVideo: 'Teacher Video',
    validateurlmsg: 'Invalid URL',
    VCE2: 'No permission to recording session',
    VCE4: 'Record data is missing',
    VCE5: 'Unable to Record Data.',
    VCE6: 'Course module is missing.',
    VideodbHeading: 'Video dashboard',
    videoInput: 'Video input',
    videooff: 'Video off',
    videoon: 'Video on',
    videoquality: 'Video quality',
    virtualclassnoteHeader: 'Add Note',
    VotedSoFar: 'Votes received so far',
    votesuccess: 'Your vote has been submitted successfully. Result will be displayed shortly.',
    votesuccessPbt: 'Vote submitted successfully, you are not permitted to see the result.',
    Vwllbshrshortly: 'Video will be shared shortly',
    viewall: 'View all',
    waitmsgconnect: 'Please wait a while. Application is trying to connect.',
    watstdrespo: 'Waiting for student’s response',
    wbrtcMsgChrome: 'You can click the deny button for not sharing your microphone and camera  with Congrea.' + 'or click allow button to share them.',
    wbrtcMsgFireFox: 'You can click on  "Share Selected Devices"' + ' to share your mic and camera feed with other users',
    webcamerainfo: 'If video is visible, webcam is working.',
    Whiteboard: 'Whiteboard',
    writemode: 'Write mode',
    youtubeshare: 'YouTube video share',
    youTubeUrl: 'Enter YouTube video URL',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    noain: 'No audio input',
    noaout: 'No audio output',
    novideo: 'No video',
    enableAllAudio: 'Unmute all',
    disableAllAudio: 'Mute all',
    colorSelector: 'Color',
    strk: 'Stroke size',
    font: 'Font size',
    size: 'Size',
    fullScreen: 'Full screen',
    exitFullScreen: 'Exit full screen',
    recordingText: 'Rec',
    recordingStopped: 'Recording Stopped',
    recordingStarted: 'Recording Started',
    continueText: 'Click here to continue',
    continue: 'Continue',
    moveSidebar: 'Move Sidebar',
    timeLimit: 'Time limit',
    noOfQuestions: 'No of questions',
    // chat files string
    online: 'Online users',
    whos: "Who's online",
    chatroom_header: 'Common chat',
    error: 'Something bad happend. Sorry!',
    wserror: 'Browser does not support WebSocket',
    sterror: "This browser doesn't support Web Storage standard",
    black: 'black',
    'dark-gray-4': 'dark gray 4',
    'dark-gray-3': 'dark gray 3',
    'dark-gray-2': 'dark gray 2',
    'dark-gray-1': 'dark gray 1',
    gray: 'gray',
    'light-gray-1': 'light gray 1',
    'light-gray-2': 'light gray 2',
    'light-gray-3': 'light gray 3',
    white: 'white',
    'red-berry': 'red berry',
    red: 'red',
    orange: 'orange',
    yellow: 'yellow',
    green: 'green',
    cyan: 'cyan',
    'cornflower-blue': 'cornflower blue',
    blue: 'blue',
    purple: 'purple',
    magenta: 'magenta',
    'light-red-berry-3': 'light red berry 3',
    'light-red-berry-2': 'light red berry 2',
    'light-red-berry-1': 'light red berry 1',
    'dark-red-berry-1': 'dark red berry 1',
    'dark-red-berry-2': 'dark red berry 2',
    'dark-red-berry-3': 'dark red berry 3',
    'light-red-3': 'light red 3',
    'light-red-2': 'light red 2',
    'light-red-1': 'light red 1',
    'dark-red-1': 'dark red 1',
    'dark-red-2': 'dark red 2',
    'dark-red-3': 'dark red 3',
    'light-orange-3': 'light orange 3',
    'light-orange-2': 'light orange 2',
    'light-orange-1': 'light orange 1',
    'dark-orange-1': 'dark orange 1',
    'dark-orange-2': 'dark orange 2',
    'dark-orange-3': 'dark orange 3',
    'light-yellow-3': 'light yellow 3',
    'light-yellow-2': 'light yellow 2',
    'light-yellow-1': 'light yellow 1',
    'dark-yellow-1': 'dark yellow 1',
    'dark-yellow-2': 'dark yellow 2',
    'dark-yellow-3': 'dark yellow 3',
    'light-green-3': 'light green 3',
    'light-green-2': 'light green 2',
    'light-green-1': 'light green 1',
    'dark-green-1': 'dark green 1',
    'dark-green-2': 'dark green 2',
    'dark-green-3': 'dark green 3',
    'light-cyan-3': 'light cyan 3',
    'light-cyan-2': 'light cyan 2',
    'light-cyan-1': 'light cyan 1',
    'dark-cyan-1': 'dark cyan 1',
    'dark-cyan-2': 'dark cyan 2',
    'dark-cyan-3': 'dark cyan 3',
    'light-cornflower-blue-3': 'light cornflower blue 3',
    'light-cornflower-blue-2': 'light cornflower blue 2',
    'light-cornflower-blue-1': 'light cornflower blue 1',
    'dark-cornflower-blue-1': 'dark cornflower blue 1',
    'dark-cornflower-blue-2': 'dark cornflower blue 2',
    'dark-cornflower-blue-3': 'dark cornflower blue 3',
    'light-blue-3': 'light blue 3',
    'light-blue-2': 'light blue 2',
    'light-blue-1': 'light blue 1',
    'dark-blue-1': 'dark blue 1',
    'dark-blue-2': 'dark blue 2',
    'dark-blue-3': 'dark blue 3',
    'light-purple-3': 'light purple 3',
    'light-purple-2': 'light purple 2',
    'light-purple-1': 'light purple 1',
    'dark-purple-1': 'dark purple 1',
    'dark-purple-2': 'dark purple 2',
    'dark-purple-3': 'dark purple 3',
    'light-magenta-3': 'light magenta 3',
    'light-magenta-2': 'light magenta 2',
    'light-magenta-1': 'light magenta 1',
    'dark-magenta-1': 'dark magenta 1',
    'dark-magenta-2': 'dark magenta 2',
    'dark-magenta-3': 'dark magenta 3',
    Shapes: 'Shapes',
    disableAllChat: 'Disable private chat',
    enableAllChat: 'Enable private chat',
    disableAllGroupChat: 'Disable common chat',
    enableAllGroupChat: 'Enable common chat',
    disableAllRaisehand: 'Disable raise hand',
    enableAllRaisehand: 'Enable raise hand',
    disableAllAskQuestion: 'Disable Raise question',
    enableAllAskQuestion: 'Enable Raise question',
    disableAllQaMarkNotes: 'Disable marks & notes',
    enableAllQaMarkNotes: 'Enable marks & notes',
    disableAllUserlist: 'Disable user list',
    enableAllUserlist: 'Enable user list',
    Audio: 'audio',
    Video: 'video',
    Chat: 'private chat',
    GroupChat: 'common chat',
    RaiseHand: 'raise hand',
    UserList: 'user list',
    uploading: 'Processing...',
    userListHeader: 'Users ',
    commonChatHeader: 'Chat Room',
    teacherVideoHeader: 'Teacher Video',
    askQuestionHeader: 'Raise Question',
    questionLable: 'Question',
    answerLable: 'Answer',
    commentLable: 'Comment',
    markAnswer: 'Mark As Answer',
    markNotes: 'Marks & Notes',
    askQuestionTimeExceed: 'Unable to edit/delete as you have exceeded the time limit',
    upvoted: 'Unable to edit/delete as upvote has been added',
    enterText: 'Enter the text before posting',
    more: '...More',
    less: 'Less',
    askQuestion: 'Raise question',
    MarksAndNotes: 'Marks & Notes',
    markAnswerUnmark: 'You need to first unmark the already marked answer',
    /* For Chrome */
    PermissionDeniedErrorExt: '<div class="errorMsg"> Camera access has been blocked.To provide webcam access, kindly follow below procedure <br />'
    + 'Go to camera icon on top right of the screen <br /> '
    + 'Click on "Always allow..." option and select the camera option <br />  '
    + 'Click on done and refresh the screen  </div> <div class="screenImages">'
    + ' <figure class="chrome" > <img src="https://www.congrea.com/wp-content/uploads/2016/10/ff-video.png" > <figcaption>Chrome</figcaption> </figure></div>',

    SecurityErrorExt: '<div class="errorMsg"> Camera access has been blocked.To provide webcam access, kindly follow below procedure <br />'
    + 'Go to camera icon on top right of the screen <br /> '
    + 'Click on "Always allow..." option and select the camera option <br />  '
    + 'Click on done and refresh the screen  </div> <div class="screenImages">'
    + ' <figure class="chrome" > <img src="https://www.congrea.com/wp-content/uploads/2016/10/ff-video.png" > <figcaption>Chrome</figcaption> </figure></div>',

    nopermissionExt: '<div class="errorMsg"> Camera access has been blocked.To provide webcam access, kindly follow below procedure <br />'
    + 'Go to camera icon on top right of the screen <br /> '
    + 'Click on "Always allow..." option and select the camera option <br />  '
    + 'Click on done and refresh the screen  </div> <div class="screenImages">'
    + ' <figure class="chrome" > <img src="https://www.congrea.com/wp-content/uploads/2016/10/ff-video.png" > <figcaption>Chrome</figcaption> </figure></div>',

    chromeExtMiss: "Congrea needs 'Desktop Selector' plugin to share the Screen.<br />"
    + "You can download this from <a href='https://chrome.google.com/webstore/detail/desktop-selector/ijhofagnokdeoghaohcekchijfeffbjl' target='_blank'>HERE.</a>",


    /* For Firefox */
    PermissionDeniedErrorExtFF: '<div class="errorMsg"> Camera access has been blocked.To provide webcam access, kindly follow below procedure <br />'
    + 'Go to camera icon on top left of the screen <br /> '
    + 'Click on "Share Selected Device." option.'
    + '<div class="screenImages">'
    + '<figure class="firefox" > <img src="https://www.congrea.com/wp-content/uploads/2016/10/ff-screnshare.png" > <figcaption>Chrome</figcaption> </figure></div>',
    screensharereload: 'Screen is not being shared. Please reload for the sharing.',

    SecurityErrorExtFF: '<div class="errorMsg"> Camera access has been blocked.To provide webcam access, kindly follow below procedure <br />'
    + 'Go to camera icon on top left of the screen <br /> '
    + 'Click on "Share Selected Device." option.'
    + '<div class="screenImages">'
    + '<figure class="firefox" > <img src="https://www.congrea.com/wp-content/uploads/2016/10/ff-screnshare.png" > <figcaption>Chrome</figcaption> </figure></div>',

    nopermissionExtFF: '<div class="errorMsg"> Camera access has been blocked.To provide webcam access, kindly follow below procedure <br />'
    + 'Go to camera icon on top left of the screen <br /> '
    + 'Click on "Share Selected Device." option.'
    + '<div class="screenImages">'
    + '<figure class="firefox" > <img src="https://www.congrea.com/wp-content/uploads/2016/10/ff-screnshare.png" > <figcaption>Chrome</figcaption> </figure></div>',
    TypeError: 'Your webcam is not initialized properly. Please reload the page.',
    newPage: 'Insert page',
  };
  window.congreaLanguages.en = message;
}(window));
