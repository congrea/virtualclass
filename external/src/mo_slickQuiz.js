/*!
 * SlickQuiz jQuery Plugin
 * http://github.com/jewlofthelotus/SlickQuiz
 *
 * @updated August 9, 2014
 * @version 1.5.164
 *
 * @author Julie Cameron - http://www.juliecameron.com
 * @copyright (c) 2013 Quicken Loans - http://www.quickenloans.com
 * @license MIT
 */

//deferredfeedback(default)
//      completionResponseMessaging: true,
//      perQuestionResponseMessaging: false,
//      perQuestionResponseAnswers:false,
//adaptive and interactive
//      completionResponseMessaging: false,
//      perQuestionResponseMessaging: true,
//      perQuestionResponseAnswers:true,

(function($){
    $.slickQuiz = function(element, options) {
        var plugin   = this,
            $element = $(element),
            _element = '#' + $element.attr('id'),

            defaults = {
                checkAnswerText:  'Check My Answer!',
                nextQuestionText: 'Next &raquo;',
                backButtonText: '&laquo; Back',
                tryAgainText: '',
                questionCountText: 'Question %current of %total',
                preventUnansweredText: 'You must select at least one answer.',
                questionTemplateText:  '%count. %text',
                scoreTemplateText: '%score / %total',
                nameTemplateText:  '<span>Quiz: </span>%name',
                skipStartButton: true,
                numberOfQuestions: null,
                randomSortQuestions: false,
                randomSortAnswers: true,
                preventUnanswered: false,
                disableScore: false,
                disableRanking: true,
                quizTime : 0,
                displayDetailResult : true,
                questionMode: 'deferredfeedback',  //(deferredfeedback(default) = completionResponseMessaging,adaptive,interactive = perQuestionResponseAnswers)
                perQuestionResponseMessaging: ( (options.questionMode != undefined && options.questionMode != 'deferredfeedback') ? true : false ),
                perQuestionResponseAnswers: ((options.questionMode != undefined && options.questionMode != 'deferredfeedback') ? true : false ),
                completionResponseMessaging: ( (options.questionMode != undefined
                    && options.questionMode != 'deferredfeedback') ? false : options.displayDetailResult ),
                //completionResponseMessaging: true,
                displayQuestionCount: false, // Deprecate?
                displayQuestionNumber: true, // Deprecate?
                submitQuestionText: 'Submit',
                questionPerPage:50,
                resultDisplayDetailed: true,
                animationCallbacks: { // only for the methods that have jQuery animations offering callback
                	setupQuiz: function () {},
                	startQuiz: function () {},
                	resetQuiz: function () {},
                	checkAnswer: function () {},
                	nextQuestion: function () {},
                	backToQuestion: function () {},
                	completeQuiz: function () {}
                },
                events: {
                	onStartQuiz: function (options) {},
                	onCompleteQuiz: function (options) {}  // reserved: options.questionCount, options.score
                }
            },

            // Class Name Strings (Used for building quiz and for selectors)
            questionCountClass     = 'questionCount',
            questionGroupClass     = 'questions',
            questionClass          = 'question',
            answersClass           = 'answers',
            responsesClass         = 'responses',
            correctClass           = 'correctResponse',
            incorrectClass         = 'incorrectResponse',
            correctResponseClass   = 'correct',
            incorrectResponseClass = 'incorrect',
            checkAnswerClass       = 'checkAnswer',
            nextQuestionClass      = 'nextQuestion',
            lastQuestionClass      = 'lastQuestion',
            backToQuestionClass    = 'backToQuestion',
            tryAgainClass          = 'tryAgain',

            // Sub-Quiz / Sub-Question Class Selectors
            _questionCount         = '.' + questionCountClass,
            _questions             = '.' + questionGroupClass,
            _question              = '.' + questionClass,
            _answers               = '.' + answersClass,
            _answer                = '.' + answersClass + ' li',
            _responses             = '.' + responsesClass,
            _response              = '.' + responsesClass + ' li',
            _correct               = '.' + correctClass,
            _correctResponse       = '.' + correctResponseClass,
            _incorrectResponse     = '.' + incorrectResponseClass,
            _checkAnswerBtn        = '.' + checkAnswerClass,
            _nextQuestionBtn       = '.' + nextQuestionClass,
            _prevQuestionBtn       = '.' + backToQuestionClass,
            _tryAgainBtn           = '.' + tryAgainClass,

            // Top Level Quiz Element Class Selectors
            _quizStarter           = _element + ' .startQuiz',
            _quizName              = _element + ' .quizName',
            _quizArea              = _element + ' .quizArea',
            _quizResults           = _element + ' .quizResults',
            _quizResultsCopy       = _element + ' .quizResultsCopy',
            _quizHeader            = _element + ' .quizHeader',
            _quizScore             = _element + ' .quizScore',
            _quizLevel             = _element + ' .quizLevel',

            // Top Level Quiz Element Objects
            $quizStarter           = $(_quizStarter),
            $quizName              = $(_quizName),
            $quizArea              = $(_quizArea),
            $quizResults           = $(_quizResults),
            $quizResultsCopy       = $(_quizResultsCopy),
            $quizHeader            = $(_quizHeader),
            $quizScore             = $(_quizScore),
            $quizLevel             = $(_quizLevel);

        var CDTimer = 0;
        var timeTakenQuiz = 0;
        // Reassign user-submitted deprecated options
        var depMsg = '';

        if (options && typeof options.disableNext != 'undefined') {
            if (typeof options.preventUnanswered == 'undefined') {
                options.preventUnanswered = options.disableNext;
            }
            depMsg += 'The \'disableNext\' option has been deprecated, please use \'preventUnanswered\' in it\'s place.\n\n';
        }

        if (options && typeof options.disableResponseMessaging != 'undefined') {
            if (typeof options.preventUnanswered == 'undefined') {
                options.perQuestionResponseMessaging = options.disableResponseMessaging;
            }
            depMsg += 'The \'disableResponseMessaging\' option has been deprecated, please use' +
                      ' \'perQuestionResponseMessaging\' and \'completionResponseMessaging\' in it\'s place.\n\n';
        }

        if (options && typeof options.randomSort != 'undefined') {
            if (typeof options.randomSortQuestions == 'undefined') {
                options.randomSortQuestions = options.randomSort;
            }
            if (typeof options.randomSortAnswers == 'undefined') {
                options.randomSortAnswers = options.randomSort;
            }
            depMsg += 'The \'randomSort\' option has been deprecated, please use' +
                      ' \'randomSortQuestions\' and \'randomSortAnswers\' in it\'s place.\n\n';
        }

        if (depMsg !== '') {
            if (typeof console != 'undefined') {
                console.warn(depMsg);
            } else {
                alert(depMsg);
            }
        }
        // End of deprecation reassignment

        plugin.config = $.extend(defaults, options);

        // Set via json option or quizJSON variable (see slickQuiz-config.js)
        var quizValuesj = (plugin.config.json ? plugin.config.json : typeof quizJSON != 'undefined' ? quizJSON : null);

        var quizValues = $.parseJSON(quizValuesj);//added by pinky

        // Get questions, possibly sorted randomly
        var questions = plugin.config.randomSortQuestions ?
                        quizValues.questions.sort(function() { return (Math.round(Math.random())-0.5); }) :
                        quizValues.questions;

        // Count the number of questions
        var questionCount = questions.length;

        //Set other options from config
        var questionMode = (plugin.config.questionMode ? plugin.config.questionMode : 'deferredfeedback');

        // Select X number of questions to load if options is set
        if (plugin.config.numberOfQuestions && questionCount >= plugin.config.numberOfQuestions) {
            questions = questions.slice(0, plugin.config.numberOfQuestions);
            questionCount = questions.length;
        }

        // some special private/internal methods
        var internal = {method: {
            // get a key whose notches are "resolved jQ deferred" objects; one per notch on the key
            // think of the key as a house key with notches on it
            getKey: function (notches) { // returns [], notches >= 1
            	var key = [];
            	for (i=0; i<notches; i++) key[i] = $.Deferred ();
            	return key;
            },

            // put the key in the door, if all the notches pass then you can turn the key and "go"
            turnKeyAndGo: function (key, go) { // key = [], go = function ()
            	// when all the notches of the key are accepted (resolved) then the key turns and the engine (callback/go) starts
            	$.when.apply (null, key). then (function () {
            		go ();
            	});
            },

            // get one jQ
            getKeyNotch: function (key, notch) { // notch >= 1, key = []
            	// key has several notches, numbered as 1, 2, 3, ... (no zero notch)
            	// we resolve and return the "jQ deferred" object at specified notch
            	return function () {
            		key[notch-1].resolve (); // it is ASSUMED that you initiated the key with enough notches
            	};
            }
        }};

        plugin.method = {
            // Sets up the questions and answers based on above array
            setupQuiz: function(options) { // use 'options' object to pass args
                console.log('quiz data setup quiz');
            	var key, keyNotch, kN;
                key = internal.method.getKey (3); // how many notches == how many jQ animations you will run
                keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
                kN = keyNotch; // you specify the notch, you get a callback function for your animation

                // Count down timer

                if (plugin.config.quizTime && plugin.config.quizTime > 0) {
                    $('#timeText').html('Time remaining <span id="qztime">' + plugin.config.quizTime + '</span>');
                } else {
                    $('#timeText').html('Elapsed time <span id="qztime">00:00:00</span>');
                }
                $quizName.hide().html(plugin.config.nameTemplateText
                    .replace('%name', quizValues.info.name) ).fadeIn(1000, kN(key,1));
                $quizHeader.hide().prepend($('<div class="quizDescription">' + quizValues.info.main + '</div>')).fadeIn(1000, kN(key,2));
                //$quizResultsCopy.append(quizValues.info.results);  //pinky

                // add retry button to results view, if enabled
                if (plugin.config.tryAgainText && plugin.config.tryAgainText !== '') {
                    $quizResultsCopy.append('<p><a class="button ' + tryAgainClass + '" href="#">' + plugin.config.tryAgainText + '</a></p>');
                }

                // Setup questions
                var quiz  = $('<ol class="' + questionGroupClass + '"></ol>'),
                    count = 1;

                // Loop through questions object
                for (i in questions) {
                    if (questions.hasOwnProperty(i)) {
                        var question = questions[i];

                        var questionHTML = $('<li data-id="' + question.qid +'" class="' + questionClass +'" id="question' + (count - 1) + '"></li>');

                        if (plugin.config.displayQuestionCount) {
                            questionHTML.append('<div class="' + questionCountClass + '">' +
                                plugin.config.questionCountText
                                    .replace('%current', '<span class="current">' + count + '</span>')
                                    .replace('%total', '<span class="total">' +
                                        questionCount + '</span>') + '</div>');
                        }

                        var formatQuestion = '';
                        if (plugin.config.displayQuestionNumber) {
                            formatQuestion = plugin.config.questionTemplateText
                                .replace('%count', count).replace('%text', question.q);
                        } else {
                            formatQuestion = question.q;
                        }
                        questionHTML.append('<div class="quesname"> <span class= "unflagged" title="flag this question for future reference"></span><span class="questext">' + formatQuestion + '</span></div>');

                        // Count the number of true values
                        var truths = 0;
                        for (i in question.a) {
                            if (question.a.hasOwnProperty(i)) {
                                answer = question.a[i];
                                if (answer.correct) {
                                    truths++;
                                }
                            }
                        }

                        // Now let's append the answers with checkboxes or radios depending on truth count
                        var answerHTML = $('<ul class="' + answersClass + '"></ul>');

                        // Get the answers
                        var answers = plugin.config.randomSortAnswers ?
                            question.a.sort(function() { return (Math.round(Math.random())-0.5); }) :
                            question.a;

                        // prepare a name for the answer inputs based on the question
                        var selectAny     = question.select_any ? question.select_any : false,
                            forceCheckbox = question.force_checkbox ? question.force_checkbox : false,
                            checkbox      = (truths > 1 && !selectAny) || forceCheckbox,
                            inputName     = 'question' + (count - 1),
                            inputType     = checkbox ? 'checkbox' : 'radio';

                        if( count == quizValues.questions.length ) {
                            nextQuestionClass = nextQuestionClass + ' ' + lastQuestionClass;
                        }

                        for (i in answers) {
                            if (answers.hasOwnProperty(i)) {
                                answer   = answers[i],
                                optionId = inputName + '_' + i.toString();

                                // If question has >1 true answers and is not a select any, use checkboxes; otherwise, radios
                                var input = '<input id="' + optionId + '" class="ansck" name="' + inputName +
                                            '" type="' + inputType + '" /> ';

                                var optionLabel = '<label for="' + optionId + '">' + answer.option + '</label>';

                                var answerContent = $('<li></li>')
                                    .append(input)
                                    .append(optionLabel);
                                answerHTML.append(answerContent);
                            }
                        }

                        // Append answers to question
                        questionHTML.append(answerHTML);

                        // If response messaging is NOT disabled, add it
                        if (plugin.config.perQuestionResponseMessaging || plugin.config.completionResponseMessaging) {
                            // Now let's append the correct / incorrect response messages
                            var responseHTML = $('<ul class="' + responsesClass + '"></ul>');
                            responseHTML.append('<li class="' + correctResponseClass + '">' + question.correct + '</li>');
                            responseHTML.append('<li class="' + incorrectResponseClass + '">' + question.incorrect + '</li>');

                            // Append responses to question
                            questionHTML.append(responseHTML);
                        }

                        // Appends check answer / back / next question buttons
                        if (plugin.config.backButtonText && plugin.config.backButtonText !== '') {
                            questionHTML.append('<a href="#" class="button ' + backToQuestionClass + '">' + plugin.config.backButtonText + '</a>');
                        }

                       // If we're not showing responses per question, show next question button and make it check the answer too
                        if (!plugin.config.perQuestionResponseMessaging) {
                            //questionHTML.append('<a href="#" class="button ' + nextQuestionClass + ' ' + checkAnswerClass + '">' + plugin.config.nextQuestionText + '</a>');
                        } else {
                            questionHTML.append('<a href="#" class="button ' + nextQuestionClass + '">' + plugin.config.nextQuestionText + '</a>');
                            questionHTML.append('<a href="#" class="button ' + checkAnswerClass + '">' + plugin.config.checkAnswerText + '</a>');
                        }
                        // IF question per page is not specified
                        if(plugin.config.questionPerPage < 1 ){
                            plugin.config.questionPerPage = quizValues.questions.length;
                        }
                        if(count == quizValues.questions.length){
                                questionHTML.append('<a href="#" class="button ' + nextQuestionClass + ' ' + checkAnswerClass + '">' + plugin.config.submitQuestionText + '</a>');
                         } else if(count == plugin.config.questionPerPage || (count % plugin.config.questionPerPage == 0)) {
                                questionHTML.append('<a href="#" class="button ' + nextQuestionClass + '" style = "display: list-item">' + plugin.config.nextQuestionText + '</a>');
                        }
                        //questionHTML.append('<div class="' + questionCountClass + '">&nbsp;</div>');//for next line

                        if(count <= plugin.config.questionPerPage){ // add perpage question count
                            questionHTML.show();//ToDo next should also be enabled
                            //(_nextQuestionBtn).fadeIn(300, kN(key,1));
                            var examnav = $(' <a href="#question' + (count - 1) +
                            '" class="qnbutton notyetanswered free thispage" title="Not yet answered" id="navquestion' +
                             (count - 1) + '">' + (count) + '</a>');
                        }else{
                            var examnav = $(' <a href="#question' + (count - 1) +
                             '" class="qnbutton notyetanswered free" title="Not yet answered" id="navquestion' +
                              (count - 1) + '">' + (count) + '</a>');
                        }
                        $( "div#exam_navblock .content .qn_buttons" ).append(examnav);
                        // Append question & answers to quiz
                        quiz.append(questionHTML);

                        count++;
                    }
                }

                // Add the quiz content to the page
                $quizArea.append(quiz);

                // Toggle the start button OR start the quiz if start button is disabled
                if (plugin.config.skipStartButton || $quizStarter.length == 0) {
                    $quizStarter.hide();
                    plugin.method.startQuiz.apply (this, [{callback: plugin.config.animationCallbacks.startQuiz}]); // TODO: determine why 'this' is being passed as arg to startQuiz method
                    kN(key,3).apply (null, []);
                } else {
                    $quizStarter.fadeIn(500, kN(key,3)); // 3d notch on key must be on both sides of if/else, otherwise key won't turn
                }

                internal.method.turnKeyAndGo (key, options && options.callback ? options.callback : function () {});
            },

            // Starts the quiz (hides start button and displays first question)
            startQuiz: function(options) {
            	var key, keyNotch, kN;
            	key = internal.method.getKey (1); // how many notches == how many jQ animations you will run
            	keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
            	kN = keyNotch; // you specify the notch, you get a callback function for your animation

                function start(options) {
                    var firstQuestion = $(_element + ' ' + _questions + ' li').first();
                    if (firstQuestion.length) {
                        firstQuestion.fadeIn(500, function () {
                        	if (options && options.callback) options.callback ();
                        });
                    }
                }

                if (plugin.config.skipStartButton || $quizStarter.length == 0) {
                    start({callback: kN(key,1)});
                } else {
                    $quizStarter.fadeOut(300, function(){
                        start({callback: kN(key,1)}); // 1st notch on key must be on both sides of if/else, otherwise key won't turn
                    });
                }

                internal.method.turnKeyAndGo (key, options && options.callback ? options.callback : function () {});

                if (plugin.config.events &&
                		plugin.config.events.onStartQuiz) {
                	plugin.config.events.onStartQuiz.apply (null, []);
                }

                //this is for timer set on page referesh
                // var storedData = JSON.parse(localStorage.getItem('quizSt'));
                // if(storedData && storedData.qtime != null){
                //     var qzTime = storedData.qtime;
                //     var res = qzTime.split(":");
                //     var qzTm = parseInt(res[2]) + (parseInt(res[1]) * 60) + (parseInt(res[0]) * 3600);
                //     var lT = qzTm - 1;
                //
                // }else {
                //     var quizPublishTime = virtualclass.vutil.UTCtoLocalTimeToSeconds(plugin.config.ptm);
                //     var currentTime = new Date().getTime();
                //     if(!virtualclass.vutil.isPlayMode()){
                //         var lT = (plugin.config.quizTime - ((currentTime -  quizPublishTime) / 1000 )); // left timing for quiz
                //     }
                // }

                  // var quizPublishTime = virtualclass.vutil.UTCtoLocalTimeToSeconds(plugin.config.ptm);
                  var quizPublishTime = plugin.config.ptm;
                  var currentTime = new Date().getTime();
                  if(!virtualclass.vutil.isPlayMode()){
                    var qzTm = ((currentTime -  quizPublishTime) / 1000 ); // left timing for quiz
                    // var lT = qzTm - 1; // We don't require this because left time is calculating at below
                  }

                if (plugin.config.quizTime && plugin.config.quizTime > 0) {
                    // Quiz timer
                    // var timeLeft = lT ? lT : plugin.config.quizTime,
                    timeLeft = virtualclass.quiz.calculateRemainingTime(plugin.config.quizTime);
                    display = document.querySelector('#qztime');
                    plugin.method.startTimer(timeLeft, display,'desc', 'vmQuiz');
                    //startTimer(timeLeft, display, 'vmQuiz');
                } else {
                    var t = qzTm ? qzTm : 0;
                    var display = document.querySelector('#qztime');
                    plugin.method.startTimer(t, display, 'asc', 'vmQuiz');
                }
            },

            // Resets (restarts) the quiz (hides results, resets inputs, and displays first question)
            resetQuiz: function(startButton, options) {
                var key, keyNotch, kN;
                key = internal.method.getKey (1); // how many notches == how many jQ animations you will run
                keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
                kN = keyNotch; // you specify the notch, you get a callback function for your animation

                $quizResults.fadeOut(300, function() {
                    $(_element + ' input').prop('checked', false).prop('disabled', false);

                    $quizLevel.attr('class', 'quizLevel');
                    $(_element + ' ' + _question).removeClass(correctClass).removeClass(incorrectClass);
                    $(_element + ' ' + _answer).removeClass(correctResponseClass).removeClass(incorrectResponseClass);

                    $(_element + ' ' + _question          + ',' +
                      _element + ' ' + _responses         + ',' +
                      _element + ' ' + _response          + ',' +
                      _element + ' ' + _nextQuestionBtn   + ',' +
                      _element + ' ' + _prevQuestionBtn
                    ).hide();

                    $(_element + ' ' + _questionCount + ',' +
                      _element + ' ' + _answers + ',' +
                      _element + ' ' + _checkAnswerBtn
                    ).show();

                    $quizArea.append($(_element + ' ' + _questions)).show();

                    kN(key,1).apply (null, []);

                    plugin.method.startQuiz({callback: plugin.config.animationCallbacks.startQuiz},$quizResults); // TODO: determine why $quizResults is being passed
                });

                internal.method.turnKeyAndGo (key, options && options.callback ? options.callback : function () {});
            },

            // Validates the response selection(s), displays explanations & next question button
            checkAnswer: function(checkButton, options) {
                var key, keyNotch, kN;
                key = internal.method.getKey (2); // how many notches == how many jQ animations you will run
                keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
                kN = keyNotch; // you specify the notch, you get a callback function for your animation
                //alert($($(checkButton).parents(_question)[0]));
                var questionLI    = $($(checkButton).parents(_question)[0]),
                    answerLIs     = questionLI.find(_answers + ' li'),
                    answerSelects = answerLIs.find('input:checked'),
                    questionIndex = parseInt(questionLI.attr('id').replace(/(question)/, ''), 10),
                    questionId    = parseInt(questionLI.attr('data-id')),
                    answers       = questions[questionIndex].a,
                    selectAny     = questions[questionIndex].select_any ? questions[questionIndex].select_any : false;

                answerLIs.addClass(incorrectResponseClass);

                // Collect the true answers needed for a correct response
                var trueAnswers = [];
                for (i in answers) {
                    if (answers.hasOwnProperty(i)) {
                        var answer = answers[i],
                            index  = parseInt(i, 10);

                        if (answer.correct) {
                            trueAnswers.push(index);
                                if(plugin.config.questionMode =='interactive'){
                                 answerLIs.eq(index).removeClass(incorrectResponseClass).addClass(correctResponseClass);
                                }
                        }else{
                            if($.inArray(index, trueAnswers) > -1){
                                trueAnswers.pop(index);
                            }

                            answerLIs.eq(index).removeClass('wrong');
                        }
                    }
                }

                // TODO: Now that we're marking answer LIs as correct / incorrect, we might be able
                // to do all our answer checking at the same time

                // NOTE: Collecting answer index for comparison aims to ensure that HTML entities
                // and HTML elements that may be modified by the browser / other scrips match up

                // Collect the answers submitted
                var selectedAnswers = [];
                answerSelects.each( function() {
                    var id = $(this).attr('id');
                    selectedAnswers.push(parseInt(id.replace(/(question\d{1,}_)/, ''), 10));
                });

                if (plugin.config.preventUnanswered && selectedAnswers.length === 0) {
                    alert(plugin.config.preventUnansweredText);
                    return false;
                }

                // Verify all/any true answers (and no false ones) were submitted
                var correctResponse = plugin.method.compareAnswers(trueAnswers, selectedAnswers, selectAny);
                $('a#nav' + (questionLI.attr('id')) + '.qnbutton').removeClass('notyetanswered').removeAttr( "title" );//remove class from navigation bar

                if (correctResponse) {
                    questionLI.addClass(correctClass);
                    if(plugin.config.questionMode != 'deferredfeedback'){
                        answerLIs.eq(selectedAnswers[0]).removeClass(incorrectResponseClass).addClass(correctResponseClass);
                    }

                    $('a#nav' + (questionLI.attr('id')) + '.qnbutton').removeClass('incorrect').addClass("correct");
                    plugin.method.sendQzdata(questionId, true);
                } else {
                    questionLI.removeClass(correctClass);
                    if(plugin.config.questionMode != 'deferredfeedback'){
                       answerLIs.eq(selectedAnswers[0]).addClass('wrong');
                        //answerLIs.eq(selectedAnswers[0]).removeClass(correctResponseClass).addClass(incorrectResponseClass);
                    }
                    $('a#nav' + (questionLI.attr('id')) + '.qnbutton').removeClass('correct').addClass("incorrect");
                    if ($(_element + ' ' + _answers).find('input:checked').length > 0 ) {
                        plugin.method.sendQzdata(questionId, false);
                    }

                }

                // Toggle appropriate response (either for display now and / or on completion)
                questionLI.find(_responses + ' li').hide();//hide response if user chance answer
                questionLI.find(correctResponse ? _correctResponse : _incorrectResponse).show();

                // If perQuestionResponseMessaging is enabled, toggle response and navigation now
                if (plugin.config.perQuestionResponseMessaging) {
                    if(plugin.config.questionMode != 'adaptive'){
                        $(checkButton).hide();
                        questionLI.find(_answers + ' li input[type=radio]').attr('disabled', true);
                    }
                    if (!plugin.config.perQuestionResponseAnswers) {
                        questionLI.find(_answers).hide();
                    }

                    questionLI.find(_responses).show();
                    //questionLI.find(_nextQuestionBtn).fadeIn(300, kN(key,1));//pinky
                    //questionLI.find(_prevQuestionBtn).fadeIn(300, kN(key,2));//hide for interactive and adaptive
                    if (!questionLI.find(_prevQuestionBtn).length) kN(key,2).apply (null, []); // 2nd notch on key must be passed even if there's no "back" button
                } else {
                    kN(key,1).apply (null, []); // 1st notch on key must be on both sides of if/else, otherwise key won't turn
                    kN(key,2).apply (null, []); // 2nd notch on key must be on both sides of if/else, otherwise key won't turn
                }

                internal.method.turnKeyAndGo (key, options && options.callback ? options.callback : function () {});

            },

            // Moves to the next question OR completes the quiz if on last question
            nextQuestion: function(nextButton, options) {
                var key, keyNotch, kN;
                key = internal.method.getKey (1); // how many notches == how many jQ animations you will run
                keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
                kN = keyNotch; // you specify the notch, you get a callback function for your animation

                var currentQuestion = $($(nextButton).parents(_question)[0]),
                    nextQuestion    = currentQuestion.next(_question),
                    answerInputs    = currentQuestion.find('input:checked');

                // If response messaging has been disabled or moved to completion,
                // make sure we have an answer if we require it, let checkAnswer handle the alert messaging
                if (plugin.config.preventUnanswered && answerInputs.length === 0) {
                    return false;
                }

                $('a#navquestion0.qnbutton').removeClass("thispage");//remove paging button highlight for first question
                $('a#navquestion0.qnbutton').nextAll('.qnbutton').removeClass("thispage");//remove paging button highlighing
                if (nextQuestion.length) {
                    currentQuestion.fadeOut(300, function(){
                    //code for page(added by pinky)
                        currentQuestion.prevAll(_question).hide();//hide all previous questions
                        if(currentQuestion.nextAll(_question).length > plugin.config.questionPerPage){
                            //index of last question of next page
                            // nextuntill not include given value hence 1 added
                            var indx = parseInt(currentQuestion.prevAll(_question).length) + parseInt(plugin.config.questionPerPage) + 1;
                            currentQuestion.nextUntil('li#question' + indx +'.question').show();
                            $('li#question' + (indx-1) +'.question').find(_prevQuestionBtn).show().end().fadeIn(500, kN(key,1));

                            $('a#nav'+currentQuestion[0].id+'.qnbutton').nextUntil('a#navquestion'+ indx +
                             '.qnbutton').addClass("thispage");//paging button highlight

                        }else{
                           currentQuestion.nextAll(_question).show();//display all next questions
                           if (!$('li#question' + (quizValues.questions.length-1) +
                           '.question').find(_prevQuestionBtn).show().end().length) kN(key,1).apply (null, []);

                           $('a#nav'+currentQuestion[0].id+'.qnbutton').nextAll('.qnbutton').addClass("thispage"); //paging button highlight
                        }
                        //if (!$('li#question' + (indx-1) +'.question').find(_prevQuestionBtn).show().end().length) kN(key,1).apply (null, []);
                        //end of code
                       //nextQuestion.find(_prevQuestionBtn).show().end().fadeIn(500, kN(key,1));
                        //if (!nextQuestion.find(_prevQuestionBtn).show().end().length) kN(key,1).apply (null, []); // 1st notch on key must be passed even if there's no "back" button
                    });
                } else {
                    kN(key,1).apply (null, []); // 1st notch on key must be on both sides of if/else, otherwise key won't turn
                    plugin.method.completeQuiz({callback: plugin.config.animationCallbacks.completeQuiz});
                }

                internal.method.turnKeyAndGo (key, options && options.callback ? options.callback : function () {});
                virtualclass.quiz.scrollToTop();
            },

            // Go back to the last question
            backToQuestion: function(backButton, options) {
                var key, keyNotch, kN;
                key = internal.method.getKey (2); // how many notches == how many jQ animations you will run
                keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
                kN = keyNotch; // you specify the notch, you get a callback function for your animation

                var questionLI = $($(backButton).parents(_question)[0]),
                    answers    = questionLI.find(_answers);

                $('a#navquestion0.qnbutton').removeClass("thispage");//remove paging button highlight for first question
                $('a#navquestion0.qnbutton').nextAll('.qnbutton').removeClass("thispage");//remove paging button highlighing.

                // Back to previous question
                if (answers.css('display') === 'block' ) {
                    var prevQuestion = questionLI.prev(_question);
                    //pinky
                     $('li#question0.question').nextAll(_question).hide();
                    if(questionLI.prevAll(_question).length >= plugin.config.questionPerPage){
                        /*var eindx = questionLI.prevAll(_question).length - (plugin.config.questionPerPage-1);
                        var sindx = eindx - plugin.config.questionPerPage;
                        if(sindx == 0){
                            $('li#question0.question').show();
                        }*/
                        var currentid = 1 + Number(questionLI.attr('id').replace( /^\D+/g, ''));
                        var remain = (currentid) % plugin.config.questionPerPage;
                        if(remain > 0 ){
                            var pno = currentid - remain;
                        }else{
                            var pno = currentid - plugin.config.questionPerPage;
                        }
                        if(pno > plugin.config.questionPerPage){
                            $('li#question' + pno + '.question').prevUntil('li#question'+ (pno-1 - plugin.config.questionPerPage) +'.question').show();
                            $('a#navquestion'+ pno + '.qnbutton').prevUntil('a#navquestion'+ (pno-1 - plugin.config.questionPerPage) +
                             '.qnbutton').addClass("thispage");//paging button highlight

                        }else{
                            $('li#question' + pno + '.question').prevAll(_question).show();
                            $('a#navquestion' + pno + '.qnbutton').prevAll('.qnbutton').addClass("thispage");;
                        }

                        //$('li#question' + sindx +'.question').nextUntil('li#question' + eindx +'.question').show();
                        //$('li#question' + (eindx-1) +'.question').nextAll(_question).hide();
                    }else{
                        questionLI.prevAll(_question).show();
                    }

                    questionLI.fadeOut(300, function() {
                        prevQuestion.removeClass(correctClass).removeClass(incorrectClass);
                        prevQuestion.find(_responses + ', ' + _responses + ' li').hide();
                        prevQuestion.find(_answers).show();
                        prevQuestion.find(_checkAnswerBtn).show();

                       /* if ((prevQuestion.attr('id') != 'question0') || (prevQuestion.attr('id') != 'question'+ indx)) {
                            prevQuestion.find(_prevQuestionBtn).show();
                        } else {
                            prevQuestion.find(_prevQuestionBtn).hide();
                        }*/
                        //prevQuestion.fadeIn(500, kN(key,1));
                        kN(key,2).apply (null, []); // 2nd notch on key must be on both sides of if/else, otherwise key won't turn
                    });

                // Back to question from responses
                } else {
                    questionLI.find(_responses).fadeOut(300, function(){
                        questionLI.removeClass(correctClass).removeClass(incorrectClass);
                        questionLI.find(_responses + ' li').hide();
                        answers.fadeIn(500, kN(key,1)); // 1st notch on key must be on both sides of if/else, otherwise key won't turn
                        questionLI.find(_checkAnswerBtn).fadeIn(500, kN(key,2));
                        questionLI.find(_nextQuestionBtn).hide();

                        // if question is first, don't show back button on question
                        if (questionLI.attr('id') != 'question0') {
                            questionLI.find(_prevQuestionBtn).show();
                        } else {
                            questionLI.find(_prevQuestionBtn).hide();
                        }
                    });
                }

                internal.method.turnKeyAndGo (key, options && options.callback ? options.callback : function () {});
              virtualclass.quiz.scrollToTop();
            },

            diaplayQuestion: function(currButton, options) {
                var key, keyNotch, kN;
                key = internal.method.getKey (1); // how many notches == how many jQ animations you will run
                keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
                kN = keyNotch; // you specify the notch, you get a callback function for your animation

                var currentQuestion = $('li'+currButton.hash+'.question'),// $($(nextButton).parents(_question)[0]),
                    nextQuestion    = currentQuestion.next(_question),
                    answerInputs    = currentQuestion.find('input:checked');

                // If response messaging has been disabled or moved to completion,
                // make sure we have an answer if we require it, let checkAnswer handle the alert messaging
                if (plugin.config.preventUnanswered && answerInputs.length === 0) {
                    return false;
                }
//$('li'+currButton.hash+'.question').css('display')
                var qno = 1 + Number(currButton.id.replace( /^\D+/g, ''));
                if (qno > plugin.config.questionPerPage) { // removed equal to for(te)
                    //currentQuestion.fadeIn(300, function(){

                        //code for page(added by pinky)
                        var remain = (qno) % plugin.config.questionPerPage;
                        if(remain > 0 ){
                            var pno = parseInt(qno / plugin.config.questionPerPage)+1;
                        }else {
                            var pno = parseInt(qno / plugin.config.questionPerPage);
                        }
                        var sqn0 = plugin.config.questionPerPage * (pno-1);
                        var eqn0 = plugin.config.questionPerPage * pno;

                        $('li#question0'+ _question).hide();
                        $('li#question0').nextAll(_question).hide();
                        $('a#navquestion0.qnbutton').nextAll('.qnbutton').removeClass("thispage");//remove button highlight
                        $('a#navquestion0.qnbutton').removeClass("thispage");//remove button highlight

                        if (sqn0 >= plugin.config.questionPerPage) {
                            $('li#question' + (sqn0-1) + '.question').nextUntil('li#question'+ eqn0 +'.question').show();
                            $('a#navquestion' + (sqn0-1) + '.qnbutton').nextUntil('a#navquestion'+ eqn0 + '.qnbutton').addClass("thispage");//highlight button
                        } else {
                            $('li#question0.question').nextUntil('li#question'+ (plugin.config.questionPerPage) + '.question').show();
                            $('a#navquestion0.qnbutton').addClass("thispage");
                            $('a#navquestion0.qnbutton').nextUntil('a#navquestion'+ (plugin.config.questionPerPage) + '.qnbutton').addClass("thispage");// highlight button
                        }
                        window.location.href = currButton.hash;
                        //if (!$('li#question' + (indx-1) +'.question').find(_prevQuestionBtn).show().end().length) kN(key,1).apply (null, []);
                        //end of code
                       //nextQuestion.find(_prevQuestionBtn).show().end().fadeIn(500, kN(key,1));
                        //if (!nextQuestion.find(_prevQuestionBtn).show().end().length) kN(key,1).apply (null, []); // 1st notch on key must be passed even if there's no "back" button
                   // });
                } else {
                    // first page
                    $('li#question0').nextAll(_question).hide(); //hide questions
                    $('a#navquestion0.qnbutton').nextAll('.qnbutton').removeClass("thispage");//remove button highlight
                    $('li#question0.question').show();
                    $('li#question0.question').nextUntil('li#question'+ (plugin.config.questionPerPage) + '.question').show();
                    $('a#navquestion0.qnbutton').addClass("thispage");
                    $('a#navquestion0.qnbutton').nextUntil('a#navquestion'+ (plugin.config.questionPerPage) + '.qnbutton').addClass("thispage");//highlight button

                    window.location.href = currButton.hash;
                    }
              /*else {
                    kN(key,1).apply (null, []); // 1st notch on key must be on both sides of if/else, otherwise key won't turn
                    plugin.method.completeQuiz({callback: plugin.config.animationCallbacks.completeQuiz});
                }*/

                //internal.method.turnKeyAndGo (key, options && options.callback ? options.callback : function () {});
              virtualclass.quiz.scrollToTop();
            },
            // flag questions
            flagQuestion: function(flagButton, options) {

                var currentQuestion = $($(flagButton).parents(_question)[0]);
                $('a#nav' + (currentQuestion.attr('id')) + '.qnbutton').toggleClass("trafficlight");
                $(flagButton).toggleClass( "flagged" );
            },
            //Countdown timer
            startTimer: function(duration, display , order, elem) {
                if(typeof CDTimer != 'undefined'){
                    clearInterval(CDTimer);
                    console.log('Clear quiz interval');
                }
                // order asc or desc
                order = typeof order !== 'undefined' ? order : 'desc';
                var start = Date.now(),
                    diff,
                    hours,
                    minutes,
                    seconds;

                function timer() {
                    if(!display && typeof CDTimer != 'undefined'){
                        clearInterval(CDTimer);
                        return;
                    }

                    // get the number of seconds that have elapsed since
                    // startTimer() was called
                    if(order == 'asc'){
                        diff = duration + (((Date.now() - start) / 1000) | 0);
                    } else {
                        diff = duration - (((Date.now() - start) / 1000) | 0);
                    }
                    // Setting and displaying hours, minutes, seconds
                    hours = (diff / 3600) | 0;
                    minutes = ((diff % 3600) / 60) | 0;
                    seconds = (diff % 60) | 0;

                    hours = hours < 10 ? "0" + hours : hours;
                    minutes = minutes < 10 ? "0" + minutes : minutes;
                    seconds = seconds < 10 ? "0" + seconds : seconds;

                    display.textContent = hours + ":" + minutes + ":" + seconds;
                    //display.innerHTML = hours + ":" + minutes + ":" + seconds;
                    // Global scope of timer
                    timeTakenQuiz = hours + ":" + minutes + ":" + seconds;

                    if (diff <= 0) {
                        // add one second so that the count down starts at the full duration
                        // example 17:00:00 not 16:59:59
                        //start = Date.now() + 1000;
                        start =0;
                        if(typeof CDTimer != 'undefined'){
                            console.log('Clear quiz interval');
                            clearInterval(CDTimer);
                        }
/*
                        $.event.trigger({
                            type: "timeend",
                            instance: elem
                        });
*/
                    }
                };
                // don't want to wait a full second before the timer starts
                if (order !== 'asc') {
                    timer();
                }
                CDTimer = setInterval(timer, 1000);
            },
            // Hides all questions, displays the final score and some conclusive information
            completeQuiz: function(options) {
                var key, keyNotch, kN;
                key = internal.method.getKey (1); // how many notches == how many jQ animations you will run
                keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
                kN = keyNotch; // you specify the notch, you get a callback function for your animation

                var aAttempted = $(_element + ' ' + _answers).find('input:checked').length;
                var marksPerQust = (Number(quizValues.info.results) / questionCount).toFixed(3);
                //var score = $(_element + ' ' + _correct).length;
                //score = score * marksPerQust;
                var currectAns = $(_element + ' ' + _correct).length;
                var score = currectAns * marksPerQust;
                var totalMarks = parseInt(quizValues.info.results);

                if (plugin.config.disableScore) {
                    $(_quizScore).remove()
                } else {
                    $(_quizScore + ' span').html(plugin.config.scoreTemplateText
                        .replace('%score', score.toFixed(2)).replace('%total', totalMarks.toFixed(2)));
                       /*$(_quizScore + ' span').html(plugin.config.scoreTemplateText
                        .replace('%score', score).replace('%total', questionCount));*/
                }

                if (plugin.config.disableRanking) {
                    $(_quizLevel).remove()
                } else {
                    var levels    = [
                                        quizValues.info.level1, // 80-100%
                                        quizValues.info.level2, // 60-79%
                                        quizValues.info.level3, // 40-59%
                                        quizValues.info.level4, // 20-39%
                                        quizValues.info.level5  // 0-19%
                                    ],
                        levelRank = plugin.method.calculateLevel(score),
                        levelText = $.isNumeric(levelRank) ? levels[levelRank] : '';

                    $(_quizLevel + ' span').html(levelText);
                    $(_quizLevel).addClass('level' + levelRank);
                }

             //   $quizArea.fadeOut(300, function() { //
                $quizArea.fadeOut(0, function() {

                    console.log('quiz data complete quiz');
                    clearInterval(CDTimer);
                    console.log('Clear quiz interval');

                    // If response messaging is set to show upon quiz completion, show it now
                    if (plugin.config.completionResponseMessaging) {
                        $(_element + ' ' + '.qnbutton').addClass('show'); //diapley navigation bar
                        $(_element + ' input').prop('disabled', true);
                        $(_element + ' .button:not(' + _tryAgainBtn + '), ' + _element + ' ' + _questionCount).hide();
                        $(_element + ' ' + _question + ', ' + _element + ' ' + _answers + ', ' + _element + ' ' + _responses).show();
                        $quizResults.append($(_element + ' ' + _questions)).fadeIn(500, kN(key,1));

                    } else {

                        if (plugin.config.quizTime && plugin.config.quizTime > 0) {
                            var tS = timeTakenQuiz.split(':');
                            var timeInSec = (+tS[0]) * 60 * 60 + (+tS[1]) * 60 + (+tS[2]);
                            var timeTaken = parseInt(plugin.config.quizTime) - timeInSec ;
                            var tt = virtualclass.quiz.convertSecToTime(timeTaken);
                        } else {
                            var tt = timeTakenQuiz;
                        }

                        //hide navigation block
                        //console.log('====> QUIZ IS CRERATING');
                        $(_element + ' ' +'.navblock').hide()
                        $quizResults.prepend($('<h4>Questions attempted: <span>'
                            + aAttempted +'</span></h4>'));
                        $quizResults.prepend($('<h4>Correct answers: <span>'
                            + currectAns +'</span></h4>'));
                        $quizResults.prepend($('<h4>Maximum mark: <span>'
                            + totalMarks.toFixed(2) +'</span></h4>'));
                        $quizResults.prepend($('<h4>Time taken: <span>'
                            + tt +'</span></h4>'));
                        $(_element + ' ' +'#timeText').hide();
                        $quizResults.prepend($('<h4>Total no of questions: <span>'
                            + questionCount +'</span></h4>'));
                        //$('.quizResults').prepend($('<div class="totalTimeTaken">' + questionCount + '</div>'))
                        $quizResults.fadeIn(500, kN(key,1)); // 1st notch on key must be on both sides of if/else, otherwise key won't turn
                    }
                    //preview mode
                    if(!roles.hasControls()) {
                    // Send score to teacher
                    console.log('quiz submit init from ' + virtualclass.gObj.uid);
                    // ParseInt converts float numbers to integer
                    var grade = (+(score) * 100 ) / +(quizValues.info.results);
                    var teacherID = virtualclass.vutil.whoIsTeacher();
                        if(virtualclass.quiz.hasOwnProperty('timeQuizComplete')){
                            clearTimeout(virtualclass.quiz.timeQuizComplete)
                        }

                        /* Don't send quiz data twice when user would join after end the session */
                        if (virtualclass.config.makeWebSocketReady) {
                          virtualclass.quiz.timeQuizComplete = setTimeout(
                            function (){
                              console.log('quiz submit from ' + virtualclass.gObj.uid);
                              virtualclass.quiz.sendSubmittedQuiz(
                                {
                                  quizMsg: 'quizsubmitted',
                                  timetaken : tt,
                                  quesattemptd: aAttempted,
                                  correctans : currectAns,
                                  score: grade.toFixed(2),
                                  user: virtualclass.gObj.uid,
                                  maxmarks: quizValues.info.results,
                                  noofqus: questionCount,
                                }
                              );
                            }, 300);
                        }




                      // // save data to storage
                      // var resultData = {
                      //         noofqus: questionCount,
                      //         timetaken : tt,
                      //         quesattemptd: aAttempted,
                      //         correctans : currectAns,
                      //         score: score,
                      //         maxmarks: quizValues.info.results
                      //     }
                      // virtualclass.quiz.quizSt.screen ='quizsubmitted';
                      // localStorage.setItem('qRep', JSON.stringify({'grade':resultData, 'attemp': null}));

                    }
                    //$('#slickQuiz .quizResults').append("<div class='finished'><button type='button'>Finised</button></div>");
                    // Save score in grade table
/*
                    $.ajax({
                        type: 'post',
                        url: 'result.php',
                        data: {
                            examid: quizValues.info.exam,
                            score: score
                        },
                        success: function( data ) {
                            console.log( data );
                        }
                    });
*/
                    //$quizResults.append("<button type='button' role='button'>Finised</button>");
                });

                internal.method.turnKeyAndGo (key, options && options.callback ? options.callback : function () {});

                if (plugin.config.events &&
                        plugin.config.events.onCompleteQuiz) {
                    plugin.config.events.onCompleteQuiz.apply (null, [{
                        questionCount: questionCount,
                        score: score
                    }]);
                }
            },

            // Compares selected responses with true answers, returns true if they match exactly
            compareAnswers: function(trueAnswers, selectedAnswers, selectAny) {
                if ( selectAny ) {
                    return $.inArray(selectedAnswers[0], trueAnswers) > -1;
                } else {
                    // crafty array comparison (http://stackoverflow.com/a/7726509)
                    return ($(trueAnswers).not(selectedAnswers).length === 0 && $(selectedAnswers).not(trueAnswers).length === 0);
                }
            },

            // Calculates knowledge level based on number of correct answers
            calculateLevel: function(correctAnswers) {
                var percent = (correctAnswers / questionCount).toFixed(2),
                    level   = null;

                if (plugin.method.inRange(0, 0.20, percent)) {
                    level = 4;
                } else if (plugin.method.inRange(0.21, 0.40, percent)) {
                    level = 3;
                } else if (plugin.method.inRange(0.41, 0.60, percent)) {
                    level = 2;
                } else if (plugin.method.inRange(0.61, 0.80, percent)) {
                    level = 1;
                } else if (plugin.method.inRange(0.81, 1.00, percent)) {
                    level = 0;
                }

                return level;
            },

            // Determines if percentage of correct values is within a level range
            inRange: function(start, end, value) {
                return (value >= start && value <= end);
            },

            sendQzdata: function(questionId, answer) {
                virtualclass.quiz.sendQuizData(quizValues.info.quiz, questionId, answer);

                // if(! roles.hasControls()) {  // To avoid preview mode
                //     var teacherID = virtualclass.vutil.whoIsTeacher();
                //     ioAdapter.mustSendUser({
                //         'quiz': {
                //             quizMsg: 'quizAttempt',
                //             quizid : quizValues.info.quiz,
                //             questionId: questionId,
                //             ans : answer,
                //             user: virtualclass.gObj.uid
                //         },
                //         'cf': 'quiz'
                //     }, teacherID);
                // }
            }
        };

        plugin.init = function() {
            // Setup quiz
            plugin.method.setupQuiz.apply (null, [{callback: plugin.config.animationCallbacks.setupQuiz}]);

            // Bind "start" button
            $quizStarter.on('click', function(e) {
                e.preventDefault();

                if (!this.disabled && !$(this).hasClass('disabled')) {
                    plugin.method.startQuiz.apply (null, [{callback: plugin.config.animationCallbacks.startQuiz}]);
                }
            });

            // Bind "try again" button
            $(_element + ' ' + _tryAgainBtn).on('click', function(e) {
                e.preventDefault();
                plugin.method.resetQuiz(this, {callback: plugin.config.animationCallbacks.resetQuiz});
            });

            // Bind "check answer" buttons
            $(_element + ' ' + _checkAnswerBtn).on('click', function(e) {
                e.preventDefault();
                plugin.method.checkAnswer(this, {callback: plugin.config.animationCallbacks.checkAnswer});
            });

            // Bind "answer" buttons( 'deferredfeedback')
            if(!plugin.config.perQuestionResponseMessaging){
                $(_element + ' ' + '.ansck').on('click', function(e) {
                    //e.preventDefault();
                    plugin.method.checkAnswer(this, {callback: plugin.config.animationCallbacks.checkAnswer});
                    //plugin.method.sendQzdata(this);
                });
            }

            // Bind "finised" buttons( 'deferredfeedback')
           /* $('#slickQuiz .quizResults .finished').on('click', function(e) {
                //e.preventDefault();
                alert('finished');
                ///alert(score);
               //plugin.method.checkAnswer(this, {callback: plugin.config.animationCallbacks.checkAnswer});
            });*/
            //a.button.nextQuestion.lastQuestion.checkAnswer

/*
            $(document).on("timeend", function(e) {
                e.preventDefault();
                clearInterval(CDTimer);
                CDTimer = 0;
                if((e.instance == 'vmQuiz') && (document.querySelector('#timeText') != null)) {
                    document.querySelector('#timeText').textContent = "Quiz has been closed";
                    $(_element + ' ' + _checkAnswerBtn).click();
                    //plugin.method.completeQuiz({callback: plugin.config.animationCallbacks.completeQuiz});
                }
                return;
                //alert(e.instance);
            });
*/

            $('#exam_navblock .qn_buttons a').on('click', function(e) {
                e.preventDefault();
                if($('li'+this.hash+'.question').css('display') == "none") {
                    plugin.method.diaplayQuestion(this, {callback: plugin.config.animationCallbacks.diaplayQuestion});
                } else {
                    window.location.href = this.hash;
                }
            });
            $(_element + ' .quesname span.unflagged').on('click', function(e) {
                e.preventDefault();
                plugin.method.flagQuestion(this, {callback: plugin.config.animationCallbacks.flagQuestion});
            });

            // Bind "back" buttons
            $(_element + ' ' + _prevQuestionBtn).on('click', function(e) {
                e.preventDefault();
                plugin.method.backToQuestion(this, {callback: plugin.config.animationCallbacks.backToQuestion});
            });

            // Bind "next" buttons
            $(_element + ' ' + _nextQuestionBtn).on('click', function(e) {
                e.preventDefault();
                plugin.method.nextQuestion(this, {callback: plugin.config.animationCallbacks.nextQuestion});
            });

            // Accessibility (WAI-ARIA).
            var _qnid = $element.attr('id') + '-name';
            $quizName.attr('id', _qnid);
            $element.attr({
              'aria-labelledby': _qnid,
              'aria-live': 'polite',
              'aria-relevant': 'additions',
              'role': 'form'
            });
            $(_quizStarter + ', [href = "#"]').attr('role', 'button');
        };
        plugin.init();
    };

    $.fn.slickQuiz = function(options) {
        return this.each(function() {
            if (undefined === $(this).data('slickQuiz')) {
                var plugin = new $.slickQuiz(this, options);
                $(this).data('slickQuiz', plugin);
                virtualclass.quiz.plugin = plugin;
            }
        });
    };
})(jQuery);
