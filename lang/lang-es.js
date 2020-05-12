(function (window) {
/**
 * {virtualclass1} {virtualclass2} are elements you passes with getString function eg:-
 *   virtualclass.lang.getString('operaBrowserIssue', ['opeara', 27]);
 *   opera and 27 will be replaced over the {virtualclass1} and {virtualclass2} resepectively for particular line of language file.
 * @type type
 */
const message = {
    ActiveAll: 'Activar todo',
    addcontext: 'Añadir marcador',
    Addoption: 'Añadir opción',
    addnew: 'Añadir nuevo',
    adminusr: 'Administrador',
    appPrerequites: 'Validar requisitos del sistema',
    assign: 'Asignar',
    assignDisable: 'Recuperar controles',
    askplayMessage: '<span id="askplaymsg"> ¿Deberíamos empezar la sesión?</span><br /><span id="remaingmsg">Los datos restantes se descargarán en segundo plano.</span>',
    askplaymsg: '<span id="askplaymsg"> "Descarga en curso, haga clic en Reproducir para comenzar </span>"',
    audioInput: 'Entrada de audio',
    audiolatency: 'Latencia de audio',
    audioOutput: 'Salida de audio',
    audioDisable: 'Dejar de silenciar',
    audioEnable: 'Silenciar',
    addQuestion: 'Añadir pregunta',
    addContext: 'Añadir marcador',
    answer: 'Respuestas',
    action: 'Acciones',
    audioTest: 'Su voz será grabada y reproducida para usted. \n Presione Ok y hable durante unos segundos.',
    Back: 'Atrás',
    bandfast: 'Conexión de red óptima',
    bandmedium: 'Conexión de red lenta',
    bandslow: 'Fallo en la conexión de red',
    bandwitdhImageNotFound: 'Error al descargar la imagen, haga clic en el botón "Siguiente" para continuar.',
    becomeTeacher: 'Convertirse en docente',
    Binary_Limit_Exeed: 'Advertencia: Alto uso de BN',
    bulkUserActions: 'Acciones masivas de usuario',
    ByInstructor: 'Por instructor',
    ByTimer: 'Por tiempo',
    cancel: 'Cancelar',
    canvasDrawMsg: 'Puede hacer clic en cualquier herramienta para dibujar' + 'haga clic y mantenga presionado el botón izquierdo del mouse para dibujar',
    canvasmissing: 'Falta el Canvas en su navegador. Actualice su navegador a la última versión.',
    chatEnable: 'Chat desactivado',
    Chatroom: 'Sala de chat',
    Circle: 'Circulo',
    ClearAll: 'Limpiar todo',
    clickheretoplay: 'Haga clic aquí para comenzar',
    clicktoplay: 'Reproducir',
    chatDisable: 'Activar chat',
    chFireBrowsersIssue: 'Su navegador {virtualclass1} {virtualclass2} necesita actualizarse, Congrea admite Chrome 40+ y Firefox 35+.',
    clearAllWarnMessageW: '¿De verdad quieres limpiar esta pizarra?',
    clearAllWarnMessageD: '¿De verdad quieres limpiar estos dibujos?',
    closedsDbheading: 'Cerrar el panel de documentos',
    closeSharePresentationdbHeading: 'Cerrar el panel de presentación',
    closevideoDashboard: 'Cerrar el panel de vídeo',
    closeVoting: 'Votación cerrada',
    cnmissing: 'Falta el número de fragmento',
    CodeEditor: 'Editar código',
    cof: 'Conexión desactivada',
    collaborate: 'Colaborar',
    commonChat: 'Chat común',
    commonBrowserIssue: 'Su navegador {virtualclass1} {virtualclass2} no es compatible, utilice la última versión de Chrome y Firefox.',
    congreainchrome: 'Tu navegador es compatible.',
    confirmCancel: 'No',
    confirmOk: 'Si',
    connectionClose: 'La conexión está cerrada ({virtualclass1}).',
    Controls: 'Controles',
    coursePoll: 'Encuesta de nivel de curso',
    Cpoll: 'Encuesta del curso',
    Cquiz: 'Cerrar cuestionario',
    createnewpoll: 'Crear nueva encuesta',
    Creator: 'Creador',
    comment: 'Comentarios',
    dap: 'Falso',
    delete: 'Eliminar',
    delblank: 'Eliminar la opción en blanco',
    Delete: 'Eliminar',
    DevicesNotFoundError: 'La webcam no se encuentra disponible, o no está conectada correctamente.',
    deletepopup: '¿Estás seguro de eliminar? ?',
    disable: 'Desactivar',
    disabled: 'Desactivar',
    disableAllVideo: 'Desactivar todo el video',
    dltDisabled: 'Puede ser eliminado por el creador de la encuesta.',
    documentShare: 'Compartir documento',
    DocumentSharing: 'Compartiendo documentos',
    DocumentSharedbHeading: 'Panel de documentos',
    docUploadSuccess: 'Documento cargado exitosamente',
    download: 'Descargar',
    downloadFile: 'Descargar archivo',
    downloadsession: 'Por favor espere mientras se descarga la grabación',
    drawArea: 'Área de dibujo',
    dropfilehere: 'Suelta los archivos aquí',
    duplicateUploadMsg: 'Este archivo ya existe, cargue un archivo nuevo.',
    edit: 'Editar',
    editorCode: 'Editor de código',
    edittitle: 'Editar título',
    editorRichDisable: 'Modo de escritura',
    editorRichEnable: 'Solo lectura',
    educator: 'Educador',
    EHTMLPresentUrl: 'Ingrese la URL de presentación HTML5',
    enable: 'Activar',
    enablehistory: '"Historial del navegador" debe habilitarse durante la sesión.',
    enableAllVideo: 'Activar todo el video',
    enteryouryoutubeurl: 'Ingrese la URL de Youtube',
    etDisabledA: 'No se puede editar, intento de encuesta',
    etDisabledCr: 'Puede ser editado por el creador de la encuesta.',
    ETime: 'Tiempo transcurrido',
    FF2: 'Avance rápido 2',
    FF8: 'Avance rápido 8',
    filenotsave: 'Su archivo no se pudo guardar.',
    filetsaveTS: 'La sesión está lista para guardarse.',
    Finish: 'Finalizado',
    fitToPage: 'Ajustar a la página',
    fitToScreen: 'Ajustar la pantalla',
    Freehand: 'A mano',
    general: 'General',
    Greport: 'Informe de calificaciones',
    highBandWidthSpeed: 'Su ancho de banda es lo suficientemente bueno.',
    httpsmissing: 'Solo se permiten orígenes seguros (https) para compartir la pantalla.',
    ieBrowserIssue: 'Internet Explorer no es compatible, Congrea es totalmente compatible con Chrome y Firefox.',
    ios7support: 'Para Apple, Virtual Class es compatible con iOS 8 y versiones superiores.',
    iosAudEnable: 'Toque aquí para habilitar el audio.',
    InternalError: 'Asegúrese de que no se esté utilizando la misma cámara web <br /> en varios navegadores o varias aplicaciones. ',
    invalidcmid: 'ID del módulo del curso no válido',
    invalidurl: 'URL inválida',
    indvprogress: 'Tarea actual',
    InsertimageURL: 'Insertar URL de la imagen',
    JoinClassMsg: 'Únete al aula',
    JoinSession: 'Únete a la session',
    keymissing: 'Su software(LMS/CMS)\'s falta la Key',
    Line: 'Línea',
    lowBandWidthSpeed: 'Su ancho de banda es demasiado bajo, estamos deteniendo la reproducción de video. Aún podrá escuchar el audio y ver la pantalla.',
    maxCommonChat: 'Mostrar ventana de chat',
    Max_rooms: 'Error: Límite máximo de salas alcanzado',
    Max_users: 'Error: Límite máximo de usuarios alcanzado',
    media: 'Media',
    mediumBandWidthSpeed: 'Su ancho de banda es limitado, estamos reduciendo la calidad de video en función de su ancho de banda disponible.',
    minCommonChat: 'Ocultar ventana de chat',
    minoption: 'Ingrese al menos dos opciones',
    microphoneNotConnected: 'El micrófono no está disponible o no está conectado correctamente',
    // 'mictesting' : 'Si la barra de audio fluctúa mientras habla, el micrófono está funcionando.',
    mictesting: 'El micrófono funciona, si la barra de audio anterior fluctúa <br />'
    + 'y puedes escuchar tu propia voz mientras hablas',
    minute: 'Minuto',
    ModeclosingPoll: 'Modo de cerrar la encuesta :',
    msgForDownloadStart: 'No se pueden guardar los datos. <br /> Preparando datos para descargar',
    msgForReload: 'Vuelva a cargar esta página para continuar editando.',
    msgForWhiteboard: 'Pizarra vacía.',
    msgStudentForReload: 'Por favor, vuelva a cargar esta página.',
    Multiple_login: 'Error: Acceso denegado, múltiples inicios de sesión',
    muteAll: 'Silenciar todo',
    muteAllAudio: 'Silenciar todo el audio',
    mybsharedoc: 'El documento se compartirá en breve.',
    NAME: 'NOMBRE',
    Next: 'Siguiente',
    note: 'Añadir nota',
    nomdlroot: 'No hay URL para Moodle.',
    normalView: 'Vista normal',
    noResultStd: 'No tiene permiso para ver el resultado.',
    NotAllowedError: 'Webcam desactivada',
    NotFoundError: 'La Webcam no está disponible o no está conectada correctamente.',
    NotReadableError: 'Asegúrese de que no se esté utilizando la misma webcam <br /> en varios navegadores o varias aplicaciones.',
    notsupportbrowser: '{virtualclass1} no es totalmente compatible. Para la mejor experiencia, use Google Chrome.',
    NotSupportedError: 'Solo se permiten orígenes seguros (https) para audio y video',
    notSupportIphone: "Lo siento. La clase virtual no es compatible con teléfonos móviles.",
    noPoll: 'No hay preguntas disponibles para la encuesta. Vaya a "Agregar nuevo" para crear una pregunta.',
    noPollNoAdmin: 'No hay preguntas disponibles para la encuesta del sitio. Solo el administrador puede crear una encuesta a nivel del sitio.',
    noQuiz: 'No hay cuestionario disponible. Agregue un cuestionario en su Moodle. Congrea solo admite preguntas de opción múltiple.',
    Novote: 'No se recibió voto para esta encuesta.',
    nowebcam: 'Webcam no disponible o no está conectada correctamente.',
    nowebcamconnectedyet: 'Congrea aún no recibió ninguna acceso de usuario.',
    notcompatiblecpu: 'La potencia del procesador en este sistema es baja. <br /> Es aconsejable trabajar con un procesador más potente',
    notcompatibleram: 'Su sistema no dispone de suficiente memoria ram. <br /> Es recomendable disponer al menos de 4GB.',
    offcollaboration: 'Colaboración descactivada',
    oncollaboration: 'Colaboración activada',
    opendsDbheading: 'Panel de documento',
    openSharePresentationdbHeading: 'Panel de Presentación',
    openvideoDashboard: 'Panel de Vídeo',
    operaBrowserIssue: 'Su navegador {virtualclass1} {virtualclass2} no es totalmente compatible. No podrá compartir su pantalla, Congrea es totalmente compatible con Chrome y Firefox',
    Options: 'Opciones',
    optselectd: 'SELECCIONAR OPCIÓN',
    Oval: 'Óvalo',
    overallprogress: 'Progreso general',
    Pause: 'Pausar',
    pclosetag: '<span>¿Estás seguro de cerrar esta encuesta?  </span>',
    pclose: '¿Estás seguro de cerrar la votación?',
    Pclosed: 'Encuesta cerrada',
    pdfnotrender: 'Hay un problema con la ventana de carga, actualice la ventana del navegador.',
    Pdsuccess: 'Encuesta eliminada exitosamente',
    PEdit: 'Editar encuesta',
    PermissionDeniedError: 'Se ha denegado el acceso a la webcam.',
    PERMISSION_DENIED: 'Denegó el acceso a su webcam (cámara/micrófono).',
    Play: 'Reproducir',
    playsessionmsg: 'Haga clic en ‘reproducir’ para comenzar la sesión.',
    pleasewaitWhSynNewCont: 'Por favor, espere un momento. Estamos sincronizando nuevo contenido.',
    plswaitwhile: 'Por favor espere....',
    poll: 'Encuesta',
    pollblank: 'La pregunta no puede dejarse en blanco',
    pollCancel: 'Cerrar',
    pollDel: '¿Estás seguro de eliminar esta encuesta?',
    pollHead: 'Vota esta encuesta',
    pollmaybeshown: 'La encuesta será publicada',
    pollmybpublish: 'La encuesta se publicará en breve.',
    pollresult: 'Resultado anterior',
    ppoll: 'Publicar encuesta',
    PQuestions: 'Preguntas de la encuesta',
    PQuiz: 'Publicar examen',
    Precheck: 'Precomprobación',
    precheckStart: 'Precomprobar',
    prechkcmplt: 'Precomprobación completa',
    Presult: 'Resultado de la encuesta',
    preWllBshortly: 'La presentación se compartirá en breve.',
    Prev: 'Anterior',
    proposedspeed: 'Velocidad propuesta',
    PSetting: 'Configurar encuesta',
    Publish: 'Publicar',
    QClosed: 'Examen cerrado',
    Question: 'Pregunta',
    Quiz: 'Examen',
    'Examen/página': 'Examen / página',
    Quizes: 'Exámenes',
    quizmayshow: 'Prepárate para una prueba',
    quizreviewpublish: 'Revisar y publicar examen',
    RaiseHandStdDisabled: 'Bajar la mano',
    RaiseHandEnable: 'Levantar la mano',
    raiseHandNotify: 'Alumno(s) levantó la mano',
    RaiseHandStdEnabled: 'Mano levantada',
    readonlymode: 'Solo lectura',
    receivedVotes: 'Votos recibidos',
    reclaim: 'Reclamar',
    Rectangle: 'Rectángulo',
    rejected: 'Otra aplicación en su computadora podría estar usando su cámara web. Debe cerrar las demás aplicaciones',
    reload: 'Recargar',
    reloadDoc: 'Recargar documento',
    removeContext: 'Eliminar marcador',
    replay: 'Repetir',
    Replay: 'Repetir desde el inicio.',
    replay_message: 'Gracias por visualizarlo.',
    requestScreenShare: 'Solicitar compartir pantalla',
    requestedScreenShare: 'Se solicita compartir pantalla',
    Reset: 'Restablecer',
    Rtime: 'Tiempo restante',
    rusureCquiz: '<span>¿Estás seguro de cerrar este cuestionario? </span>',
    rvtu: 'Votos recibidos/ usuarios totales',
    reply: 'Repetir',
    safariBrowserIssue: 'Su navegador Safari {virtualclass1} no es compatible. Es aconsejable usar Chrome y Firefox',
    Save: 'Grabar',
    savesession: '¿Quieres guardar la sesión actual?',
    savesessionTechSupport: "¿Quieres guardar la sesión actual? <br /> Una vez que descargue la sesión, las actualizaciones no estarán disponibles al volver a cargarla.",
    screensharealready: 'La pantalla se está compartiendo.',
    ScreenShare: 'Compartir pantalla',
    screensharemsg: 'La pantalla de arriba se está compartiendo.',
    screensharenotsupport: 'Pantalla compartida no soportada',
    screensharedenied: 'El usuario rechazó compartir su pantalla',
    second: 'Segundo',
    selfview: 'Deshabilitar vista pública',
    SetTimer: 'Establecer tiempo',
    sesseionkeymissing: 'Falta la KEY de la interfaz', // from javascript
    sentPackets: 'Enviar <br/><span>Paquetes</span>',
    // 'sessionend': "Close session.",
    SessionEnd: 'Sesión finalizada',
    sessionexpired: 'La sesión ha expirado',
    sessionendmsg: 'La sesión ha sido cerrada. Puede cerrar su navegador.',
    setting: 'Configuración',
    Searchuser: 'Buscar usuario',
    sendMessage: 'Enviar mensaje',
    share: 'Compartir',
    ShareVideo: 'Compartir vídeo',
    shareAnotherYouTubeVideo: 'Compartir otro vídeo de YouTube',
    SharePresentation: 'Compartir presentación',
    SharePresentationdbHeading: 'Panel de Presentación',
    sharetoall: 'Habilitar vista pública',
    Showresulttostudents: 'Mostrar resultados de los alumnos',
    sitePoll: 'Encuesta nivel del centro',
    Skip: 'Cerrar',
    someproblem: 'Hubo algún problema al cargar el archivo. Inténtelo de nuevo.',
    SourceUnavailableError: 'Por favor, asegúrese de que no se esté utilizando la misma webcam en otros navegadores o aplicaciones.',
    // 'SourceUnavailableError' : 'Otra aplicación podría estar usando su webcam. Cierre las demás aplicaciones que puedan estar utilizándola.',
    speakerTest: 'Si puedes escuchar música, los altavoces están funcionando.',
    Spoll: 'Encuesta del centro',
    ssBtn: 'Deja de compartir',
    ssStop: 'Dejar de compartir pantalla',
    startnewsession: '¿Seguro qué quieres finalizar esta sesión?',
    status: 'Estado',
    stdPublish: 'stdPublicado',
    stdscreenshare: '¿Quieres compartir tu pantalla?',
    studentAudEnable: 'Audio del alumno activado',
    studentSafariBrowserIssue: 'Su navegador {virtualclass1} {virtualclass2} no puede compartir su webcam con otros usuarios, Congrea solo es compatible con Chrome y Firefox.',
    supportDesktop: 'La clase virtual no es compatible con dispositivos móviles. Es aconsejable usar un pc o portátil.',
    supportDesktopOnly: 'Lo sentimos, el modo de presentación solo es compatible con pcs o portátiles. Los dispositivos móviles no son totalmente compatibles.',
    teacherSafariBrowserIssue: 'El navegador Safari no admite la funcionalidad de presentación. Por favor, use Chrome o Firefox.',
    techsupport: 'Apoyo técnico',
    testingbrowser: 'Test de compatibilidad del navegador',
    testinginternetspeed: 'Test de velocidad de conexión',
    testingmichrophone: 'Test de micrófono',
    testingspeaker: 'Test de altavoces',
    testingwebcam: 'Test de webcam',
    Text: 'Texto',
    Text_Limit_Exeed: 'Advertencia: Demasiado texto',
    TextEditor: 'Editor de texto',
    textPlaceholder: 'Introducir texto aquí',
    Time: 'Tiempo',
    Tmyclose: 'El docente puede cerrar esta encuesta en cualquier momento.',
    total: 'Total',
    totalprogress: 'Progreso total',
    tpAudioTest: 'Test de audio',
    transferControls: 'Controles de transferencia',
    Triangle: 'Triángulo',
    Udocument: 'Subir documento',
    Unauthenticated: 'Error: Acceso no válido',
    unmuteAll: 'Dejar de silenciar todo',
    uploadsession: 'Por favor espere a que finalice todo el proceso',
    uploadvideo: 'Subir vídeo',
    uploadedsession: 'Su sesión ha finalizado. Puede cerrar la ventana. '
    + ' o cierre esta ventana emergente para comenzar una nueva sesión.',
    usermissing: 'Falta el alumno',
    userList: "Lista de usuarios",
    upvote: 'Voto a favor',
    instructorVideo: 'Video del docente',
    validateurlmsg: 'URL no válida',
    VCE2: 'No tiene permiso para grabar esta sesión',
    VCE4: 'Faltan datos de registro',
    VCE5: 'Incapaz de registrar datos.',
    VCE6: 'Falta el módulo del curso.',
    VideodbHeading: 'Panel del vídeo',
    videoInput: 'Entrada de Vídeo',
    videooff: 'Vídeo desactivado',
    videoon: 'Vídeo activado',
    videoquality: 'Calidad de video',
    virtualclassnoteHeader: 'Añadir nota',
    VotedSoFar: 'Votos recibidos hasta ahora',
    votesuccess: 'Su voto ha sido enviado con éxito. El resultado se mostrará en breve.',
    votesuccessPbt: 'Voto enviado con éxito, no se le permite ver el resultado.',
    Vwllbshrshortly: 'El video se compartirá en breve',
    viewall: 'Ver todo',
    waitmsgconnect: 'Por favor, espere un momento. La aplicación está intentando conectarse.',
    watstdrespo: 'Esperando la respuesta del alumno',
    wbrtcMsgChrome: 'Puede hacer clic en el botón denegar para no compartir su micrófono y cámara con Congrea.' + 'o haga clic en el botón Permitir para compartirlo.',
    wbrtcMsgFireFox: 'Puedes hacer clic en  "Compartir dispositivos seleccionados"' + ' para compartir tu micrófono y cámara con otros usuarios.',
    webcamerainfo: 'Si el video es visible, la webcam está funcionando correctamente.',
    Whiteboard: 'Pizarra',
    writemode: 'Modo de escritura',
    youtubeshare: 'Compartir video de YouTube',
    youTubeUrl: 'Introducir URL del vídeo de YouTube',
    zoomIn: 'Más Zoom',
    zoomOut: 'Menos Zoom',
    noain: 'Sin entrada de audio',
    noaout: 'Sin salida de audio',
    novideo: 'No hay video',
    enableAllAudio: 'Activar todo el audio',
    disableAllAudio: 'Silenciar todo el audio',
    colorSelector: 'Color',
    strk: 'Tamaño del trazo',
    font: 'Tamaño de la fuente',
    fullScreen: 'Pantalla completa',
    exitFullScreen: 'Salir de pantalla completa',
    recordingText: 'Rec',
    recordingStopped: 'Grabación detenida',
    recordingStarted: 'Grabación iniciada',
    continueText: 'Clic aquí para continuar',
    continue: 'Seguir',
    moveSidebar: 'Mover barra lateral',
    // chat files string
    online: 'Usuarios en línea',
    whos: "Quién está en línea",
    chatroom: 'Sala de chat',
    chatroom_header: 'Chat común',
    error: 'Ha ocurrido un error. Lo sentimos!',
    wserror: 'Su navegador no es compatible con WebSocket',
    sterror: "Su navegador no es compatible con el estándar de almacenamiento web",
    
    black: 'negro',
    'dark-gray-4': 'dark gray 4',
    'dark-gray-3': 'dark gray 3',
    'dark-gray-2': 'dark gray 2',
    'dark-gray-1': 'dark gray 1',
    gray: 'gris',
    'light-gray-1': 'light gray 1',
    'light-gray-2': 'light gray 2',
    'light-gray-3': 'light gray 3',
    white: 'blanco',
    'red-berry': 'red berry',
    red: 'rojo',
    orange: 'naranja',
    yellow: 'amarillo',
    green: 'verde',
    cyan: 'cian',
    'cornflower-blue': 'cornflower blue',
    blue: 'azul',
    purple: 'morado',
    magenta: 'fucsia',
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
    Shapes: 'Formas',
    disableAllChat: 'Desactivar chat privado',
    enableAllChat: 'Activar chat privado',
    disableAllGroupChat: 'Desactivar chat común',
    enableAllGroupChat: 'Activar chat común',
    disableAllRaisehand: 'Desactivar manos levantadas',
    enableAllRaisehand: 'Activar manos levantadas',
    disableAllAskQuestion: 'Desactivar plantear pregunta',
    enableAllAskQuestion: 'Activar plantear pregunta',
    disableAllQaMarkNotes: 'Desactivar marcas y notas',
    enableAllQaMarkNotes: 'Activar marcas y notas',
    disableAllUserlist: 'Deshabilitar lista de usuarios',
    enableAllUserlist: 'Habilitar lista de usuarios',
    Audio: 'Audio',
    Video: 'Vídeo',
    Chat: 'Chat privado',
    GroupChat: 'Chat común',
    RaiseHand: 'Levantar mano',
    UserList: 'Lista de usuarios',
    uploading: 'Procesando...',
    userListHeader: 'Usuarios ',
    commonChatHeader: 'Sala de chat',
    teacherVideoHeader: 'Vídeo del docente',
    askQuestionHeader: 'Plantear una duda',
    questionLable: 'Preguntar',
    answerLable: 'Responder',
    commentLable: 'Comentar',
    markAnswer: 'Marcar como respuesta',
    markNotes: 'Marcas y notas',
    askQuestionTimeExceed: 'No se puede editar o eliminar, se ha excedido el límite de tiempo',
    upvoted: 'No se puede editar o eliminar, se ha agregado un voto positivo',
    enterText: 'Introduzca el texto antes de publicar',
    more: '...Más',
    less: 'Menos',
    askQuestion: 'Plantear la pregunta',
    MarksAndNotes: 'Marcas y notas',
    markAnswerUnmark: 'Primero debe desmarcar la respuesta ya marcada',
    /* For Chrome */
    PermissionDeniedErrorExt: '<div class="errorMsg"> Se ha bloqueado el acceso a la cámara. Para proporcionar acceso a la cámara web, siga los siguiente pasos <br />'
    + 'Ir al ícono de la cámara en la esquina superior derecha de la pantalla <br /> '
    + 'Haga clic en "Permitir siempre..." y seleccione la opción de cámara <br />  '
    + 'Acepte y actualice la pantalla  </div> <div class="screenImages">'
    + ' <figure class="chrome" > <img src="https://www.congrea.com/wp-content/uploads/2016/10/ff-video.png" > <figcaption>Chrome</figcaption> </figure></div>',

    SecurityErrorExt: '<div class="errorMsg"> Se ha bloqueado el acceso a la cámara. Para proporcionar acceso a la cámara web, siga los siguiente pasos <br />'
    + 'Ir al ícono de la cámara en la esquina superior derecha de la pantalla <br /> '
    + 'Haga clic en "Permitir siempre..." y seleccione la opción de cámara <br />  '
    + 'Acepte y actualice la pantalla  </div> <div class="screenImages">'
    + ' <figure class="chrome" > <img src="https://www.congrea.com/wp-content/uploads/2016/10/ff-video.png" > <figcaption>Chrome</figcaption> </figure></div>',

    nopermissionExt: '<div class="errorMsg"> Se ha bloqueado el acceso a la cámara. Para proporcionar acceso a la cámara web, siga los siguiente pasos <br />'
    + 'Ir al ícono de la cámara en la esquina superior derecha de la pantalla <br /> '
    + 'Haga clic en "Permitir siempre..." y seleccione la opción de cámara <br />  '
    + 'Acepte y actualice la pantalla  </div> <div class="screenImages">'
    + ' <figure class="chrome" > <img src="https://www.congrea.com/wp-content/uploads/2016/10/ff-video.png" > <figcaption>Chrome</figcaption> </figure></div>',

    chromeExtMiss: "Congrea necesita el plugin'Selector de escritorio' para compartir la pantalla.<br />"
    + "Puedes descargarlo desde <a href='https://chrome.google.com/webstore/detail/desktop-selector/ijhofagnokdeoghaohcekchijfeffbjl' target='_blank'>AQUÍ.</a>",


    /* For Firefox */
    PermissionDeniedErrorExtFF: '<div class="errorMsg"> Se ha bloqueado el acceso a la cámara. Para proporcionar acceso a la cámara web, siga los siguiente pasos <br />'
    + 'Ir al ícono de la cámara en la parte superior izquierda de la pantalla <br /> '
    + 'Haga clic en "Compartir dispositivo seleccionado.".'
    + '<div class="screenImages">'
    + '<figure class="firefox" > <img src="https://www.congrea.com/wp-content/uploads/2016/10/ff-screnshare.png" > <figcaption>Chrome</figcaption> </figure></div>',
    screensharereload: 'La pantalla no se comparte. Vuelva a cargar para compartir.',

    SecurityErrorExtFF: '<div class="errorMsg"> Se ha bloqueado el acceso a la cámara. Para proporcionar acceso a la cámara web, siga los siguiente pasos <br />'
    + 'Ir al ícono de la cámara en la parte superior izquierda de la pantalla <br /> '
    + 'Haga clic en "Compartir dispositivo seleccionado.".'
    + '<div class="screenImages">'
    + '<figure class="firefox" > <img src="https://www.congrea.com/wp-content/uploads/2016/10/ff-screnshare.png" > <figcaption>Chrome</figcaption> </figure></div>',

    nopermissionExtFF: '<div class="errorMsg"> Se ha bloqueado el acceso a la cámara. Para proporcionar acceso a la cámara web, siga los siguiente pasos <br />'
    + 'Ir al ícono de la cámara en la parte superior izquierda de la pantalla <br /> '
    + 'Haga clic en "Compartir dispositivo seleccionado.".'
    + '<div class="screenImages">'
    + '<figure class="firefox" > <img src="https://www.congrea.com/wp-content/uploads/2016/10/ff-screnshare.png" > <figcaption>Chrome</figcaption> </figure></div>',
    TypeError: 'Su webcam no está inicializada correctamente. Por favor recarga la página.',
    newPage: 'Insertar página',
};
window.congreaLanguages.es = message;
}(window));
    
    