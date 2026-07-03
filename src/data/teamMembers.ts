/** 팀 id(0=1조, 1=2조, ...)별 팀원 명단 */
export const TEAM_MEMBERS_BY_ID: string[][] = [
  ['김보아', '김종수', '박진우', '유지후', '류병희', '서지윤', '하재서'],
  ['김민성', '이휘성', '공서린', '신정은'],
  ['김상지', '김현서', '이준성', '최윤규', '신승범', '엄자민'],
  ['이채은', '이정훈', '주승제', '강성진', '정연아', '서윤도'],
  ['이지우', '김규빈', '황다희', '최정인', '조환희', '유승훈'],
]

/** 운영진 명단 (황금열쇠 등) */
export const STAFF_MEMBERS = ['이채은', '김민성', '김상지', '김보아', '이지우']

export function getTeamMembers(teamId: number): string[] {
  return TEAM_MEMBERS_BY_ID[teamId] ?? []
}

export function pickRandomTeamMember(members: string[], exclude?: string): string {
  if (members.length === 0) return '팀원'
  if (members.length === 1) return members[0]

  const pool = exclude ? members.filter((member) => member !== exclude) : members
  if (pool.length === 0) return members[0]

  return pool[Math.floor(Math.random() * pool.length)]
}
