from flask import Flask, render_template, request, jsonify, redirect
import python.data as data

app = Flask(__name__, template_folder='template/pages', static_folder='template')

@app.route('/')
def index():
    all_data = data.fetch_all_data()  # 전체 데이터 조회
    completed_days = []
    in_progress_days = []

    for entry in all_data:
        day = entry.get('day')
        if not day:
            continue

        plans = entry.get('plans', [])
        if not isinstance(plans, list):
            plans = []

        # 체크 여부 판단
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

    day_data = data.fetch_data(day)
    print(f"Fetched study time data for day={day}: {day_data}")
    if not day_data:
        return jsonify({'error': '해당 날짜 데이터가 없습니다.'}), 404

    # 리스트 벗기기 및 키 확인
    study_time = day_data[0].get('studyTime')
    print(study_time)
    if not study_time:
        study_time = {'hours': '0', 'minutes': '0'}
    return jsonify({'studyTime': study_time})


@app.route('/createNote', methods=['POST'])
def create_note():
    req_data = request.get_json()
    day = req_data.get('day')

    if not day:
        return jsonify({'message': 'day 값이 필요합니다.'}), 400

    day_data = data.fetch_data(day)
    print(f"Create note check for day={day}: {day_data}")
    if day_data:
        return jsonify({'redirect_url': f'/openNote?day={day}'})
    else:
        return jsonify({'redirect_url': f'/schedule?day={day}'})

@app.route('/openNote')
def open_note():
    day = request.args.get('day', 'unknown')
    day_data = data.fetch_data(day)
    print(f"Open note data for day={day}: {day_data}")

    note_data = day_data[0] if day_data else {}
    return render_template('SchedulerPage.html', day=day, note_data=note_data)

@app.route('/schedule')
def schedule():
    day = request.args.get('day', 'unknown')
    day_data = data.fetch_data(day)
    print(f"Schedule page data for day={day}: {day_data}")

    note_data = day_data[0] if day_data else {}
    study_time = note_data.get('study_time') if note_data else None
    return render_template('SchedulerPage.html', day=day, study_time=study_time, note_data=note_data)

@app.route('/saveData', methods=['POST'])
def save_data():
    req_data = request.get_json(force=True)
    if not req_data or 'day' not in req_data:
        return jsonify({'message': 'day 값이 필요합니다.'}), 400

    # 필드 정리
    if 'memo' not in req_data:
        req_data['memo'] = ''
    if 'comment' in req_data:
        del req_data['comment']  # JS에서 보낼 경우 제거

    day = req_data['day']
    print(f"💾 저장 요청: day={day} → 데이터: {req_data}")

    existing_data = data.fetch_data(day)

    if existing_data:
        # ✅ 데이터 존재 → 수정
        print(f"✅ 기존 데이터 존재 → 수정 실행")
        status = data.update_data(day, req_data)
        print(status)
        if status is None or status == 204:
            return jsonify({'message': f'day_{day} 수정 성공'}), 200
        else:
            return jsonify({'message': f'day_{day} 수정 실패'}), 500
    else:
        # ❌ 데이터 없음 → 새로 저장
        print(f"📥 기존 데이터 없음 → 새로 저장")
        data.upload_data(req_data)
        return jsonify({'message': f'day_{day} 저장 성공'}), 200
    


@app.route('/deleteData')
def delete_data_route():
    day = request.args.get('day')
    if not day:
        return "day 값이 필요합니다.", 400

    response = data.delete_data(day)
    if response is None or response == 204:
        return redirect('/')
    else:
        return f"데이터 삭제 실패: {response}", 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=False)
