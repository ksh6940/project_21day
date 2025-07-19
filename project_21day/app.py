from flask import Flask, render_template, request, jsonify, redirect
import models  

app = Flask(__name__, template_folder='template/pages', static_folder='template')

@app.route('/')
def index():
    all_data = models.fetch_all_data()
    completed_days = []
    in_progress_days = []

    for entry in all_data:
        day = entry.get('day')
        if not day:
            continue

        plans = entry.get('plans', [])
        if not isinstance(plans, list):
            plans = []

        if not plans:
            in_progress_days.append(day)
            continue

        all_checked = all(item.get('checked', False) for item in plans)

        if all_checked:
            completed_days.append(day)
        else:
            in_progress_days.append(day)

    return render_template('homepage.html',
                           day='unknown',
                           note_data={},
                           completed_days=completed_days,
                           in_progress_days=in_progress_days)

@app.route('/getStudyTime')
def get_study_time():
    day = request.args.get('day')
    if not day:
        return jsonify({'error': 'day 값이 필요합니다.'}), 400

    day_data = models.fetch_data(day)
    if not day_data:
        return jsonify({'error': '해당 날짜 데이터가 없습니다.'}), 404

    study_time = day_data[0].get('studyTime')
    if not study_time:
        study_time = {'hours': '0', 'minutes': '0'}
    return jsonify({'studyTime': study_time})


@app.route('/createNote', methods=['POST'])
def create_note():
    req_data = request.get_json()
    day = req_data.get('day')

    if not day:
        return jsonify({'message': 'day 값이 필요합니다.'}), 400

    return jsonify({'redirect_url': f'/schedule?day={day}'})

@app.route('/schedule')
def schedule():
    day = request.args.get('day', 'unknown')
    day_data = models.fetch_data(day)
    note_data = day_data[0] if day_data else {}
    return render_template('SchedulerPage.html', day=day, note_data=note_data)

@app.route('/saveData', methods=['POST'])
def save_data():
    req_data = request.get_json(force=True)
    if not req_data or 'day' not in req_data:
        return jsonify({'message': 'day 값이 필요합니다.'}), 400

    if 'memo' not in req_data:
        req_data['memo'] = ''
    if 'comment' in req_data:
        del req_data['comment']

    day = req_data['day']
    existing_data = models.fetch_data(day)

    if existing_data:
        status = models.update_data(day, req_data)
        if status is None or status == 204:
            return jsonify({'message': f'day_{day} 수정 성공'}), 200
        else:
            return jsonify({'message': f'day_{day} 수정 실패'}), 500
    else:
        models.upload_data(req_data)
        return jsonify({'message': f'day_{day} 저장 성공'}), 200

@app.route('/deleteData', methods=['DELETE'])
def delete_data_route():
    day = request.args.get('day')
    if not day:
        return jsonify({'message': 'day 값이 필요합니다.'}), 400

    response = models.delete_data(day)
    if response is None or response == 204:
        return jsonify({'message': '삭제 성공'}), 200
    else:
        return jsonify({'message': f'데이터 삭제 실패: {response}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=False)
